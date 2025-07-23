import { describe, expect, it } from "vitest"
import { randomStringGenerator } from "./random"

describe("random string generator", () => {
  it("should generate a random string of a given length", () => {
    const length = 16
    const generator = randomStringGenerator("a-z", "-_")
    const randomString = generator(length)
    expect(randomString).toBeDefined()
    expect(randomString).toHaveLength(length)
  })

  it("should generate a random string with custom alphabet", () => {
    const generator = randomStringGenerator("0-9", "A-Z")
    const randomString = generator(8)
    const allowedChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    expect([...randomString].every(char => allowedChars.includes(char))).toBeTruthy()
  })

  it("should use new alphabet when given during generation", () => {
    const generator = randomStringGenerator("a-z")
    const newAlphabet = "A-Z"
    const randomString = generator(10, newAlphabet)
    const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    expect([...randomString].every((char) => allowedChars.includes(char))).toBe(
      true,
    )
  })

  it("should throw an error for invalid length", () => {
    const generator = randomStringGenerator("a-z")
    expect(() => generator(0))
      .toThrowError("Random string generator size must be a positive integer")
    expect(() => generator(-8))
      .toThrowError("Random string generator size must be a positive integer")
  })

  it("should throw an error for invalid alphabet", () => {
    try {
      // @ts-expect-error - using invalid alphabet
      randomStringGenerator("xyz")
    }
    catch (error) {
      if (error instanceof Error) {
        expect(error).toHaveProperty("message")
        expect(error.message).toBe("Random string generator must have valid alphabet")
      }
      else {
        throw error
      }
    }
  })
})
