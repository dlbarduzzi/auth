import type { CookieOptions } from "@/tools/http/cookie"

import { hmac } from "@/tools/crypto/hmac"
import { serializeCookie } from "@/tools/http/cookie"

type CookieParams = {
  name: string
  value: string
  headers: Headers
  options: CookieOptions
}

export function setCookie({
  name,
  value,
  headers,
  options,
}: CookieParams) {
  const cookie = serializeCookie(name, value, options)
  headers.append("Set-Cookie", cookie)
}

export async function setSignedCookie(secret: string, {
  name,
  value,
  headers,
  options,
}: CookieParams) {
  const signature = await hmac.sign(value, secret)
  value = `${value}.${signature}`
  const serialized = serializeCookie(name, value, options)
  headers.append("Set-Cookie", serialized)
}
