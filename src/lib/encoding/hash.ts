import { subtle } from "crypto"

export async function createHashSHA256Hex(value: string) {
  const data = new TextEncoder().encode(value)
  const buffer = await subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(buffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}
