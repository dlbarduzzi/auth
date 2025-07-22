import { hex } from "./hex"
import { Buffer } from "node:buffer"
import { describe, expect, it } from "vitest"

describe("hex encode", () => {
  it("should encode a string to hexadecimal", () => {
    const input = "Hello, World!"
    expect(hex.encode(input)).toBe(Buffer.from(input).toString("hex"))
  })

  it("should encode an ArrayBuffer to hexadecimal", () => {
    const input = new TextEncoder().encode("Hello")
    expect(hex.encode(input)).toBe(Buffer.from(input).toString("hex"))
  })

  it("should encode a TypedArray to hexadecimal", () => {
    const input = new Uint8Array([72, 101, 108, 108, 111])
    expect(hex.encode(input)).toBe(Buffer.from(input).toString("hex"))
  })
})

describe("hex decode", () => {
  it("should decode a hexadecimal string to its original value", () => {
    const input = "Hello, World!"
    expect(hex.decode(Buffer.from(input).toString("hex"))).toBe(input)
  })

  it("should decode a hexadecimal string to binary data", () => {
    const input = "Hello"
    expect(hex.decode(Buffer.from(input).toString("hex"))).toBe(input)
  })

  it("should decode a hexadecimal string to bytes data", () => {
    const input = "Hello"
    const encoded = hex.decode(Buffer.from(input).toString("hex"), "bytes")
    expect(encoded.toString()).toBe("72,101,108,108,111")
  })

  it("should throw an error for an invalid length string", () => {
    const input = "123"
    expect(() => hex.decode(input)).toThrowError("Invalid hexadecimal string")
  })

  it("should throw an error for a non-hexadecimal string", () => {
    const input = "xxxx"
    expect(() => hex.decode(input)).toThrowError("Invalid hexadecimal string")
  })
})

describe("hex encode and decode", () => {
  it("should decode original string", () => {
    const input = "Hello, World!"
    const encoded = hex.encode(input)
    const decoded = hex.decode(encoded)
    expect(decoded).toBe(input)
  })

  it("should handle empty strings", () => {
    const input = ""
    const encoded = hex.encode(input)
    const decoded = hex.decode(encoded)
    expect(decoded).toBe(input)
  })
})
