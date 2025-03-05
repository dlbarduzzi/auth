import { github } from "@/services/auth/providers/client"
import { COOKIE_NAMES } from "@/services/auth/utils"
import { storeOAuthCookie } from "@/services/auth/actions/cookies"
import { generateRandomString } from "@/lib/crypto/random"

export async function GET() {
  const state = generateRandomString(32)
  await storeOAuthCookie(COOKIE_NAMES.GITHUB_STATE, state)
  const authUrl = github.createAuthorizationURL(state)
  return new Response(null, { status: 302, headers: { location: authUrl } })
}
