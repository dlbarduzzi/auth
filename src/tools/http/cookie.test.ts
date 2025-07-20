import { cookie } from "./cookie"
import { describe, expect, it } from "vitest"

describe("parse cookie", () => {
  const testCookie = "cookie_one=value-one; cookie_two=value-two"

  it("should get all cookies", () => {
    const result = cookie(testCookie).getAll()
    expect(result.size).toBe(2)
    expect(result.get("cookie_one")).toBe("value-one")
    expect(result.get("cookie_two")).toBe("value-two")
  })

  it("should get one cookies", () => {
    const result = cookie(testCookie).getOne("cookie_one")
    expect(result.size).toBe(1)
    expect(result.get("cookie_one")).toBe("value-one")
  })

  it("should return no cookies", () => {
    const result = cookie(testCookie).getOne("non_existent")
    expect(result.size).toBe(0)
    expect(result.get("non_existent")).toBeUndefined()
  })

  it("should return no cookies for invalid cookie", () => {
    const result = cookie("invalid").getAll()
    expect(result.size).toBe(0)
  })

  it("should return no cookies for not found cookie name", () => {
    const result = cookie(testCookie).getOne("cookie")
    expect(result.size).toBe(0)
  })
})
