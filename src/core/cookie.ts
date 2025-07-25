import type { SetHeaders } from "./types"
import type { CookieOptions } from "@/tools/http/cookie"
import type { UserSchema, SessionSchema } from "@/db/schemas"

import z from "zod"

import { hmac } from "@/tools/crypto/hmac"
import { decodeBase64url, encodeBase64url } from "@/tools/crypto/base64"

import {
  getOneCookie,
  serializeCookie,
  SECURE_PREFIX,
} from "@/tools/http/cookie"

import { env } from "./env"
import { strToDateSchema } from "./schemas"
import { createTime, getDate } from "./time"

import { sessionSchema, userSchema } from "@/db/schemas"

type CookieParams = {
  name: string
  value: string
  headers: SetHeaders
  options: CookieOptions
}

function setCookie({
  name,
  value,
  headers,
  options,
}: CookieParams) {
  const cookie = serializeCookie(name, value, options)
  // headers.append("Set-Cookie", cookie)
  headers("Set-Cookie", cookie, { append: true })
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
    options: (options?: CookieOptions) => createCookieOptions({
      maxAge: createTime(5, "m").toSeconds(),
      ...options,
    }),
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
    options: (options?: CookieOptions) => createCookieOptions({
      maxAge: createTime(7, "d").toSeconds(),
      ...options,
    }),
  },
}

async function getSignedCookie(name: string, secret: string, headers: Headers) {
  const cookie = headers.get("cookie")
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

async function setCachedCookie(
  data: { user: UserSchema, session: SessionSchema },
  secret: string,
  headers: SetHeaders,
) {
  const sessionDataCookieName = cookies.data.name
  const sessionDataCookieOptions = cookies.data.options()

  const maxAge = sessionDataCookieOptions.maxAge
    ? sessionDataCookieOptions.maxAge
    : createTime(5, "m").toSeconds()

  const expiresAt = getDate(maxAge, "sec").getTime()
  const signature = await hmac.sign(JSON.stringify({ ...data, expiresAt }), secret)

  const payload = encodeBase64url(JSON.stringify({
    data,
    expiresAt,
    signature,
  }), false)

  if (payload.length > 4093) {
    throw new Error(`Session data is too large (${payload.length})`)
  }

  setCookie({
    name: sessionDataCookieName,
    value: payload,
    headers,
    options: sessionDataCookieOptions,
  })
}

export async function getCachedCookie(secret: string, headers: Headers) {
  const cookie = headers.get("cookie")
  if (!cookie) {
    return null
  }

  const name = cookies.data.name
  const result = await getOneCookie(name, cookie)

  const cookieValue = result.get(name)
  if (!cookieValue) {
    return null
  }

  let payload: unknown
  try {
    payload = JSON.parse(decodeBase64url(cookieValue, "string") as string)
  }
  catch {
    payload = null
  }

  if (!payload) {
    return null
  }

  const schema = z.object({
    data: z.object({
      user: userSchema.extend({
        createdAt: strToDateSchema,
        updatedAt: strToDateSchema,
      }),
      session: sessionSchema.extend({
        expiresAt: strToDateSchema,
        createdAt: strToDateSchema,
        updatedAt: strToDateSchema,
      }),
    }),
    expiresAt: z.number(),
    signature: z.string(),
  })

  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    return null
  }

  const { data, expiresAt, signature } = parsed.data

  const isVerified = await hmac.verify(JSON.stringify({
    ...data,
    expiresAt,
  }), secret, signature)

  if (!isVerified) {
    return null
  }

  return data
}

export async function setSessionCookie({ data, headers, remember }: {
  data: {
    user: UserSchema
    session: SessionSchema
  }
  headers: {
    get: Headers
    set: SetHeaders
  }
  remember?: boolean
}) {
  const doNotRemember = "false"

  const sessionTokenCookieName = cookies.token.name
  const sessionRememberCookieName = cookies.remember.name

  const rememberCookie = await getSignedCookie(
    sessionRememberCookieName,
    env.AUTH_SECRET,
    headers.get,
  )

  remember = remember !== undefined
    ? remember
    : rememberCookie !== doNotRemember

  await setSignedCookie({
    name: sessionTokenCookieName,
    value: data.session.token,
    secret: env.AUTH_SECRET,
    headers: headers.set,
    options: cookies.token.options({
      secure: sessionTokenCookieName.startsWith(SECURE_PREFIX),
      maxAge: remember ? createTime(7, "d").toSeconds() : undefined,
    }),
  })

  if (!remember) {
    await setSignedCookie({
      name: sessionRememberCookieName,
      value: doNotRemember,
      secret: env.AUTH_SECRET,
      headers: headers.set,
      options: cookies.remember.options({
        secure: sessionRememberCookieName.startsWith(SECURE_PREFIX),
        maxAge: createTime(7, "d").toSeconds(),
      }),
    })
  }

  await setCachedCookie(data, env.AUTH_SECRET, headers.set)
}
