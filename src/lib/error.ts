export class AuthError extends Error {
  public caller: string
  constructor(message: string, { cause, caller }: { cause: string; caller: string }) {
    super(message)
    this.name = "AuthError"
    this.cause = cause
    this.caller = caller
  }
}

export class AuthDatabaseError extends AuthError {
  constructor(message: string, { cause, caller }: { cause: string; caller: string }) {
    super(message, { cause, caller })
    this.name = "AuthDatabaseError"
  }
}
