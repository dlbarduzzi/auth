import { describe, expect, it } from "vitest"
import { lowercase, capitalize } from "./index"

describe("lowercase string", () => {
  it("should lowercase string", () => {
    expect(lowercase("Hello, world!")).toBe("hello, world!")
    expect(lowercase("HELLO, WORLD!")).toBe("hello, world!")
    expect(lowercase("Hello, World!")).toBe("hello, world!")
  })
})

describe("capitalize string", () => {
  it("should capitalize string", () => {
    expect(capitalize("hello, world!")).toBe("Hello, world!")
    expect(capitalize("HELLO, WORLD!")).toBe("HELLO, WORLD!")
    expect(capitalize("hello, World!")).toBe("Hello, World!")
  })
})
