import { z } from "zod"
import { describe, expect, it } from "vitest"

import { simplifyZodError } from "./zod"

describe("simplifyZodError", () => {
  it("stringify simple schema error", () => {
    const schema = z.number()
    const parsed = schema.safeParse("")

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    expect(result).toContain(
      // eslint-disable-next-line quotes
      '"path":[],"message":"Expected number, received string"'
    )
  })

  it("stringify object schema error", () => {
    const schema = z.object({ name: z.string() })
    const parsed = schema.safeParse("")

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    // eslint-disable-next-line quotes
    expect(result).toContain('"message":"Expected object, received string"')
  })

  it("stringify object schema error with missing field", () => {
    const schema = z.object({ name: z.string() })
    const parsed = schema.safeParse({})

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    // eslint-disable-next-line quotes
    expect(result).toContain('"path":["name"],"message":"Required"')
  })

  it("stringify array schema error with missing field", () => {
    const schema = z.array(z.object({ name: z.string().min(1) }))
    const parsed = schema.safeParse([{}])

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    // eslint-disable-next-line quotes
    expect(result).toContain('"path":[0,"name"],"message":"Required"')
  })

  it("stringify object with array schema error", () => {
    const schema = z.object({ user: z.array(z.object({ name: z.string() })) })
    const parsed = schema.safeParse({ user: [{}] })

    if (parsed.success) {
      throw new Error("expected schema to fail")
    }

    const result = simplifyZodError(parsed.error)
    expect(typeof result).toBe("string")

    // eslint-disable-next-line quotes
    expect(result).toContain('"path":["user",0,"name"],"message":"Required"')
  })
})
