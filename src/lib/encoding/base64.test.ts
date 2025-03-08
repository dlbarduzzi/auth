import { describe, expect, it } from "vitest"

import {
  encodeBase64UrlPadding,
  encodeBase64UrlNoPadding,
  decodeBase64UrlPadding,
} from "./base64"

import { decodeBinary } from "./binary"

describe("base64", () => {
  const input = "Hello, world!"
  const buffer = new TextEncoder().encode(input)
  const base64UrlPadding = "SGVsbG8sIHdvcmxkIQ=="
  const base64UrlNoPadding = "SGVsbG8sIHdvcmxkIQ"

  describe("encode", () => {
    it("encodes data to base64 with padding", () => {
      const result = encodeBase64UrlPadding(buffer)
      expect(result).toBe(base64UrlPadding)
    })
    it("encodes data to base64 without padding", () => {
      const result = encodeBase64UrlNoPadding(buffer)
      expect(result).toBe(base64UrlNoPadding)
    })
  })

  describe("decode", () => {
    it("decodes a base64 string", async () => {
      const encoded = Buffer.from(input).toString("base64")
      const result = decodeBase64UrlPadding(encoded)
      expect(decodeBinary(result)).toBe(input)
    })

    it("decodes data to base64 without padding", async () => {
      const result = decodeBase64UrlPadding(base64UrlNoPadding)
      expect(decodeBinary(result)).toBe(input)
    })
  })
})
