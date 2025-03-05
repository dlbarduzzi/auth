import { createSHA256 } from "@/lib/crypto/sha256"

export const COOKIE_NAMES = {
  GITHUB_STATE: "github_oauth_state",
  GOOGLE_STATE: "google_oauth_state",
  GOOGLE_CODE_VERIFIER: "google_oauth_code_verifier",
}

export async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier)
  const codeChallenge = await createSHA256(data)
  return codeChallenge
}
