import { describe, expect, it } from "vitest"

import { generateRandomString } from "./random"

describe("generateRandomString", () => {
  it("generates a random string for a given length", () => {
    const length = 12
    const result = generateRandomString(length)
    expect(result).toBeDefined()
    expect(result).toHaveLength(length)
  })

  it("throws an error when length is less than 1", () => {
    expect(() => generateRandomString(0)).toThrowError("length must be 1 or higher")
    expect(() => generateRandomString(-6)).toThrowError("length must be 1 or higher")
  })
})
