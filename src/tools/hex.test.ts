import { describe, it, expect } from "vitest"
import { encodeHex } from "./hex"

describe("encodeHex", () => {
  it("should encode a ArrayBuffer to hexadecimal", () => {
    const input = new Uint8Array([72, 101, 108, 108, 111])
    expect(encodeHex(input)).toBe(Buffer.from(input).toString("hex"))
  })
  it("should encode a ArrayBufferLike to hexadecimal", () => {
    const input = new TextEncoder().encode("Hello, World!")
    expect(encodeHex(input)).toBe(Buffer.from(input).toString("hex"))
  })
})
