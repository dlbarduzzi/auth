import { github } from "@/services/auth/client"
import { generateId } from "@/services/auth/utils"
import { getSession } from "@/services/auth/actions/sessions"
import { COOKIE_NAMES } from "@/services/auth/vars"
import { createOAuthCookie } from "@/services/auth/actions/cookies"

export async function GET() {
  const session = await getSession()
  if (session != null) {
    return new Response(null, { status: 302, headers: { location: "/profile" } })
  }
  const state = generateId(32)
  await createOAuthCookie(COOKIE_NAMES.GITHUB_STATE, state)
  const authUrl = github.createAuthorizationURL(state)
  return new Response(null, { status: 302, headers: { location: authUrl } })
}
