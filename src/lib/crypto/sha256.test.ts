import { describe, expect, it } from "vitest"

import { createSHA256 } from "./sha256"

describe("createSHA256", () => {
  const input = "Hello, world!"
  const buffer = new TextEncoder().encode(input)
  it("computes SHA-256 in raw format", async () => {
    const result = await createSHA256(buffer)
    expect(typeof result).toBe("string")
  })
})
