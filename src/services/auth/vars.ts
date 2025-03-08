export const COOKIE_NAMES = {
  PREFIX: "auth",
  SESSION_TOKEN: "session_token",
  GITHUB_STATE: "github_oauth_state",
  GOOGLE_STATE: "google_oauth_state",
  GOOGLE_CODE_VERIFIER: "github_oauth_code_verifier",
}

export const OAUTH_ERRORS = {
  CODE_NOT_FOUND: "CodeNotFound",
  STATE_NOT_FOUND: "StateNotFound",
  STORED_STATE_NOT_FOUND: "StoredStateNotFound",
  STATES_NOT_MATCHED: "StatesNotMatched",
  CODE_VERIFIER_NOT_FOUND: "CodeVerifierNotFound",
  INTERNAL_SERVER_ERROR: "InternalServerError",
} as const

export type OAuthError = (typeof OAUTH_ERRORS)[keyof typeof OAUTH_ERRORS]
