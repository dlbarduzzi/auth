import { describe, expect, it } from "vitest"

import { createHashSHA256Hex } from "./hash"

describe("createHashSHA256Hex", () => {
  const input = "Hello, world!"
  it("computes SHA-256 in raw format", async () => {
    const result = await createHashSHA256Hex(input)
    expect(typeof result).toBe("string")
  })
})
