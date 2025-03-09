import type { ArrayNumber, SHAfamily, EncodingFormat } from "./types"

import { subtle } from "uncrypto"

import { encodeHex, decodeHex } from "./hex"
import { decodeBase64, encodeBase64url } from "./base64"

export async function hmacImportKey(
  key: string | ArrayBuffer | ArrayNumber,
  keyUsage: "sign" | "verify",
  algorithm: SHAfamily = "SHA-256"
) {
  return await subtle.importKey(
    "raw",
    typeof key === "string" ? new TextEncoder().encode(key) : key,
    { name: "HMAC", hash: { name: algorithm } },
    false,
    [keyUsage]
  )
}

export async function hmacSign(
  key: string | CryptoKey,
  data: string | ArrayBuffer | ArrayNumber,
  encoding: EncodingFormat = "none"
) {
  if (typeof key === "string") {
    key = await hmacImportKey(key, "sign")
  }
  const signature = await subtle.sign(
    "HMAC",
    key,
    typeof data === "string" ? new TextEncoder().encode(data) : data
  )
  if (encoding === "hex") {
    return encodeHex(signature)
  }
  if (
    encoding === "base64" ||
    encoding === "base64url" ||
    encoding === "base64urlNoPadding"
  ) {
    return encodeBase64url(signature, encoding !== "base64urlNoPadding")
  }
  return signature
}

export async function hmacVerify(
  key: string | CryptoKey,
  data: string | ArrayBuffer | ArrayNumber,
  signature: string | ArrayBuffer | ArrayNumber,
  encoding: EncodingFormat = "none"
) {
  if (typeof key === "string") {
    key = await hmacImportKey(key, "verify")
  }
  if (encoding === "hex") {
    signature = decodeHex(signature)
  }
  if (
    encoding === "base64" ||
    encoding === "base64url" ||
    encoding === "base64urlNoPadding"
  ) {
    signature = await decodeBase64(signature)
  }
  return subtle.verify(
    "HMAC",
    key,
    typeof signature === "string" ? new TextEncoder().encode(signature) : signature,
    typeof data === "string" ? new TextEncoder().encode(data) : data
  )
}
