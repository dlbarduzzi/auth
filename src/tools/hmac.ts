import { subtle } from "uncrypto"

import { encodeHex } from "./hex"

export type SHAfamily = "SHA-256"

export async function hmacSignSHA256(key: string, data: string) {
  const hmacKey = await hmacImportKey(key, "sign", "SHA-256")
  const signature = await subtle.sign("HMAC", hmacKey, new TextEncoder().encode(data))
  return encodeHex(signature)
}

export async function hmacImportKey(
  key: string,
  keyUsage: "sign" | "verify",
  algorithm: SHAfamily
) {
  return await subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: { name: algorithm } },
    false,
    [keyUsage]
  )
}
