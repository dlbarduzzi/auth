import { describe, expect, it } from "vitest"
import { hmacImportKey, hmacSignSHA256 } from "./hmac"

describe("hmac", () => {
  const key = "test-hmac-secret"
  const data = "Hello, world!"
  const algorithm = "SHA-256"

  it("should imports a key for HMAC", async () => {
    const hmacKey = await hmacImportKey(key, "sign", algorithm)
    expect(hmacKey).toBeDefined()
    expect(hmacKey.algorithm.name).toBe("HMAC")
    expect((hmacKey.algorithm as HmacKeyAlgorithm).hash.name).toBe(algorithm)
  })

  it("should sign data using HMAC SHA256", async () => {
    const signature = await hmacSignSHA256(key, data)
    expect(signature).toBe(
      "c66da5627c530dc453f3436c9fdca05df2d09b86dbd5a90f25e5f671525e8b6b"
    )
    expect(signature.length).toBeGreaterThan(0)
  })
})
