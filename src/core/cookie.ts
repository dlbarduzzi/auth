import type { CookieOptions } from "@/tools/http/cookie"
import type { UserSchema, SessionSchema } from "./schemas"

import { hmac } from "@/tools/crypto/hmac"
import { serializeCookie, SECURE_PREFIX, getOneCookie } from "@/tools/http/cookie"

import { env } from "./env"
import { createTime } from "./time"

type CookieParams = {
  name: string
  value: string
  headers: Headers
  options: CookieOptions
}

function setCookie({
  name,
  value,
  headers,
  options,
}: CookieParams) {
  const cookie = serializeCookie(name, value, options)
  headers.append("Set-Cookie", cookie)
}

async function setSignedCookie({
  name,
  value,
  secret,
  headers,
  options,
}: CookieParams & { secret: string }) {
  const signature = await hmac.sign(value, secret)
  value = `${value}.${signature}`
  setCookie({ name, value, headers, options })
}

function createCookieName(name: string) {
  const secure = env.APP_URL.startsWith("https://") || env.NODE_ENV === "production"
  const prefix = secure ? SECURE_PREFIX : ""
  return `${prefix}${env.COOKIE_PREFIX}.${name}`
}

function createCookieOptions(options?: CookieOptions): CookieOptions {
  return {
    path: "/",
    sameSite: "Lax",
    httpOnly: true,
    ...options,
  }
}

const cookies = {
  data: {
    name: createCookieName("session_data"),
    options: (options?: CookieOptions) => createCookieOptions(options),
  },
  token: {
    name: createCookieName("session_token"),
    options: (options?: CookieOptions) => createCookieOptions({
      maxAge: createTime(7, "d").toSeconds(),
      ...options,
    }),
  },
  remember: {
    name: createCookieName("session_remember"),
    options: (options?: CookieOptions) => createCookieOptions(options),
  },
}

async function getSignedCookie(name: string, secret: string, headers: Headers) {
  const cookie = headers.get("Cookie")
  if (!cookie) {
    return null
  }

  const result = await getOneCookie(name, cookie)

  const cookieValue = result.get(name)
  if (!cookieValue) {
    return null
  }

  const index = cookieValue.lastIndexOf(".")
  if (index < 0) {
    return null
  }

  const value = cookieValue.substring(0, index)
  const signature = cookieValue.substring(index + 1)

  const isVerified = await hmac.verify(value, secret, signature)
  if (!isVerified) {
    return null
  }

  return value
}

export async function setSessionCookie(
  data: { user: UserSchema, session: SessionSchema },
  headers: Headers,
  remember?: boolean,
) {
  const sessionTokenCookieName = cookies.token.name
  const sessionRememberCookieName = cookies.remember.name

  const rememberCookie = await getSignedCookie(
    sessionRememberCookieName,
    env.AUTH_SECRET,
    headers,
  )
  console.warn({ rememberCookie })

  await setSignedCookie({
    name: sessionTokenCookieName,
    value: data.session.token,
    secret: env.AUTH_SECRET,
    headers,
    options: cookies.token.options({
      secure: sessionTokenCookieName.startsWith(SECURE_PREFIX),
      maxAge: remember ? createTime(7, "d").toSeconds() : undefined,
    }),
  })

  await setSignedCookie({
    name: sessionRememberCookieName,
    value: "false",
    secret: env.AUTH_SECRET,
    headers,
    options: cookies.token.options({
      secure: sessionRememberCookieName.startsWith(SECURE_PREFIX),
      maxAge: 100000,
    }),
  })
}
