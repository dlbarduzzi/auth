import { describe, expect, it } from "vitest"

import { createSHA256Hash } from "./hash"

describe("createSHA256Hash", () => {
  const input = "Hello, world!"
  const buffer = new TextEncoder().encode(input)
  it("computes SHA-256 in raw format", async () => {
    const result = await createSHA256Hash(buffer)
    expect(typeof result).toBe("string")
  })
})
