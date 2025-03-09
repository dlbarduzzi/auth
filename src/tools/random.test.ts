import { describe, expect, it } from "vitest"
import { generateRandomString, Alphabet } from "./random"

describe("random", () => {
  it("should generate a random string of given length", () => {
    const length = 16
    const randomString = generateRandomString(length, "a-z")
    expect(randomString).toBeDefined()
    expect(randomString).toHaveLength(length)
  })

  it("should generate a random string using a custom alphabet", () => {
    const randomString = generateRandomString(8, "A-Z", "0-9")
    const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    expect([...randomString].every(char => allowedChars.includes(char))).toBe(true)
  })

  it("throws an error when no valid characters are provided", () => {
    // `"!?" as Alphabet` is incorrect. We are manually
    // adding it here to make eslint not to complain about it.
    expect(() => generateRandomString(12, "!?" as Alphabet)).toThrowError(
      "Unsupported alphabet: !?"
    )
  })

  it("should throw an error when length is not positive", () => {
    expect(() => generateRandomString(0)).toThrowError("Length must be 1 or higher")
    expect(() => generateRandomString(-6)).toThrowError("Length must be 1 or higher")
  })

  it("should respect a new alphabet when provided", () => {
    const newAlphabet = "A-Z"
    const randomString = generateRandomString(10, newAlphabet)
    const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    expect([...randomString].every(char => allowedChars.includes(char))).toBe(true)
  })

  it("should generate consistent randomness with valid mask calculations", () => {
    const randomString = generateRandomString(10, "0-9")
    const allowedChars = "0123456789"
    expect([...randomString].every(char => allowedChars.includes(char))).toBe(true)
  })
})
