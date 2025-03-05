import { google } from "@/services/auth/providers/client"
import { COOKIE_NAMES } from "@/services/auth/utils"
import { storeOAuthCookie } from "@/services/auth/actions/cookies"
import { generateRandomString } from "@/lib/crypto/random"

export async function GET() {
  const state = generateRandomString(32)
  const codeVerifier = generateRandomString(128)
  await storeOAuthCookie(COOKIE_NAMES.GOOGLE_STATE, state)
  await storeOAuthCookie(COOKIE_NAMES.GOOGLE_CODE_VERIFIER, codeVerifier)
  const authUrl = await google.createAuthorizationURL(state, codeVerifier)
  return new Response(null, { status: 302, headers: { location: authUrl } })
}
