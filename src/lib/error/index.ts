export class AppFetchError extends Error {
  constructor(cause: unknown) {
    super("request failed", { cause })
    this.name = "AppFetchError"
  }
}

export class AppDatabaseError extends Error {
  constructor(cause: unknown) {
    super("database query failed", { cause })
    this.name = "AppDatabaseError"
  }
}

export class AppResponseError extends Error {
  public status: number
  constructor(code: number, cause: string) {
    super("unexpected response error", { cause })
    this.name = "AppResponseError"
    this.status = code
  }
}

export class AppResponseBodyError extends Error {
  public details: unknown
  constructor(cause: string, details: unknown) {
    super("unexpected response body error", { cause })
    this.name = "AppResponseBodyError"
    this.details = details
  }
}

export class AppOAuthRequestError extends Error {
  public details: string
  constructor(cause: string, details: string) {
    super("oauth request failed", { cause })
    this.name = "AppOAuthRequestError"
    this.details = details
  }
}
