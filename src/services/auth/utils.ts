import { subtle } from "uncrypto"

import { generateRandomString } from "@/lib/crypto/random"
import { encodeBase64, encodeBase64url } from "@/lib/encoding/base64"

export function generateId(length: number = 32) {
  return generateRandomString(length, "a-z", "A-Z", "0-9")
}

export async function generateCodeChallenge(value: string) {
  const data = new TextEncoder().encode(value)
  const buffer = await subtle.digest("SHA-256", data)
  return encodeBase64url(new Uint8Array(buffer), false)
}

export function encodeBasicCredentials(username: string, password: string) {
  const data = new TextEncoder().encode(`${username}:${password}`)
  return encodeBase64(data, true)
}
