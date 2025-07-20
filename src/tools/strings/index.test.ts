import { lowercase } from "./index"
import { describe, expect, it } from "vitest"

describe("lowercase string", () => {
  it("should lowercase string", () => {
    expect(lowercase("Hello")).toBe("hello")
    expect(lowercase("HELLO")).toBe("hello")
    expect(lowercase("Hello, World!")).toBe("hello, world!")
    expect(lowercase("HELLO, WORLD!")).toBe("hello, world!")
  })
})
