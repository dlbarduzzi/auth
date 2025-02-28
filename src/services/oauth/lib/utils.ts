import type { ZodError } from "zod"

import crypto from "crypto"

export function generateState() {
  return crypto.randomBytes(32).toString("hex").normalize()
}

export function encodeBase64(bytes: Uint8Array) {
  return btoa(Array.from(bytes, byte => String.fromCodePoint(byte)).join(""))
}

export function encodeBasicCredentials(username: string, password: string) {
  const bytes = new TextEncoder().encode(`${username}:${password}`)
  return encodeBase64(bytes)
}

export function stringifyZodError(error: ZodError) {
  const errors = new Map<string, string>()

  error.issues.map(issue => {
    if (!issue.path || issue.path.length < 1) {
      return
    }
    if (!issue.message || issue.message.trim() === "") {
      return
    }
    if (typeof issue.path[0] === "string") {
      errors.set(issue.path[0], issue.message)
      return
    }
    if (issue.path.length === 2 && typeof issue.path[1] === "string") {
      errors.set(issue.path[1], issue.message)
      return
    }
  })

  try {
    return JSON.stringify(Object.fromEntries(errors))
  } catch {
    return "Failed to stringify Zod error"
  }
}
