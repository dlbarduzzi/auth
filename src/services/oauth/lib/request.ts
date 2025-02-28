export function createOAuthRequest(url: string, body: URLSearchParams) {
  const request = new Request(url, {
    method: "POST",
    body: new TextEncoder().encode(body.toString()),
  })
  request.headers.set("Accept", "application/json")
  request.headers.set("Content-Type", "application/x-www-form-urlencoded")
  return request
}

export class AppFetchError extends Error {
  constructor(cause: unknown) {
    super("Failed to send request", { cause })
    this.name = "AppFetchError"
  }
}

export class UnexpectedResponseError extends Error {
  public status: number
  constructor(status: number) {
    super("Unexpected response error")
    this.name = "UnexpectedResponseError"
    this.status = status
  }
}

export class InvalidRequestError extends Error {
  constructor(cause: unknown) {
    super("Invalid request error", { cause })
    this.name = "InvalidRequestError"
  }
}

export class OAuthRequestError extends Error {
  public code: string
  public description: string
  constructor(code: string, description: string) {
    super("Oauth request error")
    this.name = "OAuthRequestError"
    this.code = code
    this.description = description
  }
}

export class UnexpectedResponseBodyError extends Error {
  public code: string
  public status: number
  public details: unknown
  constructor(code: string, status: number, details: unknown) {
    super("Unexpected response body error")
    this.name = "UnexpectedResponseBodyError"
    this.code = code
    this.status = status
    this.details = details
  }
}
