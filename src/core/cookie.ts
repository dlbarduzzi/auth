import type { CookieOptions } from "@/tools/http/cookie"
import type { UserSchema, SessionSchema } from "./schemas"

import { hmac } from "@/tools/crypto/hmac"
import { serializeCookie } from "@/tools/http/cookie"

import { env } from "./env"

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

export async function setSessionCookie(
  data: { user: UserSchema, session: SessionSchema },
  headers: Headers,
  rememberMe?: boolean,
) {
  console.warn({ rememberMe })

  await setSignedCookie({
    name: "session_token",
    value: data.session.token,
    secret: env.AUTH_SECRET,
    headers,
    options: {},
  })
}
