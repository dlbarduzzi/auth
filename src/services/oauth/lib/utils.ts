import type { ZodError } from "zod"

import crypto from "crypto"

export function generateState() {
  return crypto.randomBytes(32).toString("hex").normalize()
}

export function encodeBase64(bytes: Uint8Array) {
  return btoa(Array.from(bytes, byte => String.fromCodePoint(byte)).join(""))
}

export function encodeBasicCredentials(username: string, password: string) {
  const bytes = new TextEncoder().encode(`${username}:${password}`)
  return encodeBase64(bytes)
}

export function stringifyZodError(error: ZodError) {
  const errors: string[] = []
  Object.entries(error.flatten().fieldErrors).forEach(([field, message]) => {
    if (!message || message.length < 1) return
    errors.push(`${field}(${message[0]})`)
  })
  return errors.join("::")
}
