import { describe, it, expect } from "vitest"
import { encodeBase64, encodeBase64url } from "./base64"

describe("base64", () => {
  const buffer = new TextEncoder().encode("Hello, World!")
  const encodedBase64 = "SGVsbG8sIFdvcmxkIQ=="
  const base64UrlEncoded = "SGVsbG8sIFdvcmxkIQ"
  describe("encode", () => {
    it("encodes an ArrayBuffer to base64", async () => {
      const result = encodeBase64(buffer, true)
      expect(result).toBe(encodedBase64)
    })
    it("encodes an ArrayBuffer to base64 URL safe", async () => {
      const result = encodeBase64url(buffer, false)
      expect(result).toBe(base64UrlEncoded)
    })
  })
})
