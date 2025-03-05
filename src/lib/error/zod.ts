import type { ZodError } from "zod"

// simplifyZodError returns a small string version of the error
// to avoid polluting logs when an error is thrown.
export function simplifyZodError(error: ZodError) {
  try {
    return JSON.stringify(
      error.issues
        .slice(0, 5)
        .map(issue => ({ path: issue.path, message: issue.message }))
    )
  } catch {
    return "failed to simplify zod error"
  }
}
