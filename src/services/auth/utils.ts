import { subtle } from "crypto"

import { generateRandomString } from "@/lib/crypto/random"
import { encodeBase64UrlNoPadding } from "@/lib/encoding/base64"

export function generateId(length: number = 32) {
  return generateRandomString(length, "a-z", "A-Z", "0-9")
}

export async function generateCodeChallenge(value: string) {
  const data = new TextEncoder().encode(value)
  const buffer = await subtle.digest("SHA-256", data)
  return encodeBase64UrlNoPadding(new Uint8Array(buffer))
}
