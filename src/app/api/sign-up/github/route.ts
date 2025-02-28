import { github } from "@/services/oauth/github/client"
import { generateState } from "@/services/oauth/lib/utils"
import { storeStateCookie } from "@/services/oauth/actions/cookies"
import { GITHUB_COOKIE_STATE } from "@/services/oauth/github/constants"

export async function GET() {
  const state = generateState()
  const authURL = github.createAuthorizationURL(state)
  await storeStateCookie(GITHUB_COOKIE_STATE, state)
  return new Response(null, { status: 302, headers: { location: authURL } })
}
