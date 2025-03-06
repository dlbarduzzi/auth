import { subtle } from "crypto"
import { encodeBase64UrlNoPadding } from "../encoding/base64"

export async function createSHA256Hash(data: Uint8Array) {
  const buffer = await subtle.digest("SHA-256", data)
  return encodeBase64UrlNoPadding(new Uint8Array(buffer))
}
