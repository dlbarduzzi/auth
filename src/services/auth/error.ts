export const OAUTH_ERRORS = {
  CODE_NOT_FOUND: "CodeNotFound",
  STATE_NOT_FOUND: "StateNotFound",
  STORED_STATE_NOT_FOUND: "StoredStateNotFound",
  STATES_NOT_MATCHED: "StatesNotMatched",
  CODE_VERIFIER_NOT_FOUND: "CodeVerifierNotFound",
  USER_EMAIL_NOT_VERIFIED: "UserEmailNotVerified",
  PRIMARY_USER_EMAIL_NOT_FOUND: "PrimaryUserEmailNotFound",
  INTERNAL_SERVER_ERROR: "InternalServerError",
} as const

export type OAuthError = (typeof OAUTH_ERRORS)[keyof typeof OAUTH_ERRORS]

export class OAuthRequestError extends Error {
  public cause: OAuthError
  constructor(cause: OAuthError) {
    super("oauth request failed")
    this.name = this.constructor.name
    this.cause = cause
  }
}
