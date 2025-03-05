import { z } from "zod"
import { describe, expect, it } from "vitest"

import { simplifyZodError } from "./zod"

describe("simplifyZodError", () => {
  it("stringify text schema error", () => {
    const input = ""
    const schema = z.string().min(1)
    const parsed = schema.safeParse(input)

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    expect(result).toContain(
      // eslint-disable-next-line quotes
      '[{"path":[],"message":"String must contain at least 1 character(s)"}]'
    )
  })

  it("stringify object schema error with text", () => {
    const input = ""
    const schema = z.object({ name: z.string().min(1) })
    const parsed = schema.safeParse(input)

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    // eslint-disable-next-line quotes
    expect(result).toContain('"message":"Expected object, received string"')
  })

  it("stringify object schema error with object", () => {
    const input = { name: "" }
    const schema = z.object({ name: z.string().min(1) })
    const parsed = schema.safeParse(input)

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    expect(result).toContain(
      // eslint-disable-next-line quotes
      '{"path":["name"],"message":"String must contain at least 1 character(s)"}'
    )
  })

  it("stringify array of objects schema error with object", () => {
    const input = { name: "" }
    const schema = z.array(z.object({ name: z.string().min(1) }))
    const parsed = schema.safeParse(input)

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    // eslint-disable-next-line quotes
    expect(result).toContain('"message":"Expected array, received object"')
  })

  it("stringify array of objects schema error with array", () => {
    const input = [{ name: "" }]
    const schema = z.array(z.object({ name: z.string().min(1) }))
    const parsed = schema.safeParse(input)

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    expect(result).toContain(
      // eslint-disable-next-line quotes
      '"path":[0,"name"],"message":"String must contain at least 1 character(s)"'
    )
  })

  it("stringify object with array schema error", () => {
    const input = { user: [{ name: "" }] }
    const schema = z.object({ user: z.array(z.object({ name: z.string().min(1) })) })
    const parsed = schema.safeParse(input)

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    expect(result).toContain(
      // eslint-disable-next-line quotes
      '{"path":["user",0,"name"],"message":"String must contain at least 1'
    )
  })
})
