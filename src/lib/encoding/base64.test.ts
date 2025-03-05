import { describe, expect, it } from "vitest"

import { encodeBase64UrlPadding, encodeBase64UrlNoPadding } from "./base64"

describe("encodeBase64", () => {
  const input = "Hello, world!"
  const buffer = new TextEncoder().encode(input)
  const encodedBase64UrlPadding = "SGVsbG8sIHdvcmxkIQ=="
  const encodedBase64UrlNoPadding = "SGVsbG8sIHdvcmxkIQ"

  it("encodes data to base64 with padding", () => {
    const result = encodeBase64UrlPadding(buffer)
    expect(result).toBe(encodedBase64UrlPadding)
  })

  it("encodes data to base64 without padding", () => {
    const result = encodeBase64UrlNoPadding(buffer)
    expect(result).toBe(encodedBase64UrlNoPadding)
  })
})
