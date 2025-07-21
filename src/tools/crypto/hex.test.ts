import { hex } from "./hex"
import { Buffer } from "node:buffer"
import { describe, expect, it } from "vitest"

describe("hex encode", () => {
  it("should encode an ArrayBuffer to hexadecimal", () => {
    const input = new Uint8Array([72, 101, 108, 108, 111]).buffer
    expect(hex.encode(input)).toBe(Buffer.from(input).toString("hex"))
  })
})
