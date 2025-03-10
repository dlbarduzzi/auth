import type { ZodError } from "zod"

export class DatabaseError extends Error {
  constructor(cause: unknown) {
    super("database query failed", { cause })
    this.name = this.constructor.name
  }
}

export class FetchRequestError extends Error {
  constructor(cause: unknown) {
    super("fetch request failed", { cause })
    this.name = this.constructor.name
  }
}

export class FetchResponseError extends Error {
  public status?: number
  public details?: unknown
  constructor({
    cause,
    status,
    details,
  }: {
    cause: unknown
    status?: number
    details?: unknown
  }) {
    super("fetch response failed", { cause })
    this.name = this.constructor.name
    if (status) this.status = status
    if (details) this.details = details
  }
}

export function stringifyZodError(error: ZodError, length: number = 5) {
  const errors = error.issues
    .slice(0, length < 1 ? 1 : length)
    .map(issue => ({ path: issue.path, message: issue.message }))
  try {
    return JSON.stringify(errors)
  } catch {
    return "failed to simplify zod error"
  }
}
