import { describe, expect, it } from "vitest"

import { createHashSHA256Hex, createHmacSHA256Hash } from "./hash"

describe("createHashSHA256Hex", () => {
  const input = "Hello, world!"
  it("computes SHA-256 in raw format", async () => {
    const result = await createHashSHA256Hex(input)
    expect(typeof result).toBe("string")
  })
})

describe("createHmacSHA256Hash", () => {
  const input = "Hello, world!"
  const secret = "test123"
  it("computes SHA-256 in with a secret", async () => {
    const result1 = await createHashSHA256Hex(input)
    const result2 = await createHmacSHA256Hash(secret, input)
    expect(typeof result1).toBe("string")
    expect(typeof result2).toBe("string")
    expect(result1).not.toEqual(result2)
    const result3 = await createHmacSHA256Hash(secret, input)
    expect(typeof result3).toBe("string")
    expect(result2).toEqual(result3)
  })
})
