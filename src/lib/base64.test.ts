import { describe, expect, it } from "vitest"

import { encodeBase64Padding, encodeBase64NoPadding } from "./base64"

describe("base64", () => {
  const plainText = "Hello, world!"
  const plainBuffer = new TextEncoder().encode(plainText)
  const encodedBase64Padding = "SGVsbG8sIHdvcmxkIQ=="
  const encodedBase64NoPadding = "SGVsbG8sIHdvcmxkIQ"
  it("encodes bytes to base64 with padding", () => {
    const result = encodeBase64Padding(plainBuffer)
    expect(result).toBe(encodedBase64Padding)
  })
  it("encodes bytes to base64 without padding", () => {
    const result = encodeBase64NoPadding(plainBuffer)
    expect(result).toBe(encodedBase64NoPadding)
  })
})
