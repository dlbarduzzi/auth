import { hex } from "./hex"
import { subtle } from "uncrypto"

const algorithm = { name: "HMAC", hash: { name: "SHA-256" } }

export const hmac = {
  key: async (secret: string) => {
    return await subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      algorithm,
      false,
      ["sign", "verify"],
    )
  },
  sign: async (value: string, secret: string) => {
    const key = await hmac.key(secret)
    const buffer = await subtle.sign(
      algorithm.name,
      key,
      new TextEncoder().encode(value),
    )
    return hex.encode(buffer)
  },
  verify: async (value: string, secret: string, signature: string) => {
    const data = new Uint8Array(signature.length / 2)
    for (let i = 0; i < data.length; i++) {
      data[i] = Number.parseInt(signature.slice(i * 2, i * 2 + 2), 16)
    }
    const key = await hmac.key(secret)
    const buffer = new Uint8Array(data)
    return await subtle.verify(
      algorithm.name,
      key,
      buffer,
      new TextEncoder().encode(value),
    )
  },
}
