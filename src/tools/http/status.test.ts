import { describe, expect, it } from "vitest"
import { status, toStatusText } from "./status"

describe("status codes", () => {
  it("should match status code and text", () => {
    expect(toStatusText(status.code.ok))
      .toBe(status.text.ok)
    expect(toStatusText(status.code.created))
      .toBe(status.text.created)
    expect(toStatusText(status.code.badRequest))
      .toBe(status.text.badRequest)
    expect(toStatusText(status.code.unauthorized))
      .toBe(status.text.unauthorized)
    expect(toStatusText(status.code.forbidden))
      .toBe(status.text.forbidden)
    expect(toStatusText(status.code.notFound))
      .toBe(status.text.notFound)
    expect(toStatusText(status.code.unprocessableEntity))
      .toBe(status.text.unprocessableEntity)
    expect(toStatusText(status.code.internalServerError))
      .toBe(status.text.internalServerError)
  })

  it("should throw an error with invalid status code", () => {
    // @ts-expect-error: force error to test catch behavior
    expect(() => toStatusText("test")).toThrowError("Invalid status code: test")
  })
})
