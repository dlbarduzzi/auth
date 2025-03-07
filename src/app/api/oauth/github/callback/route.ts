import { env } from "@/env/server"
import { generateId } from "@/services/auth/utils"
import { createSessionCookie } from "@/services/auth/actions/cookies"
import { getSession, createSession } from "@/services/auth/actions/sessions"

export async function GET() {
  if (1 > 0) {
    return new Response("GitHub Callback", { status: 200 })
  }
  const session = await getSession()
  if (session != null) {
    return new Response(null, { status: 302, headers: { location: "/profile" } })
  }
  const token = generateId(32)
  const userId =
    env.NODE_ENV === "production"
      ? "26f0d41b-17cb-4673-935a-802ad6d4fda8"
      : "cc8c2f6c-54f6-4f37-8518-f2c9f5b8e3f7"
  try {
    const session = await createSession(token, userId)
    await createSessionCookie(token, session.expiresAt)
    console.log(`Cookie session created with session id ${session.id}`)
  } catch (error) {
    console.log(error)
    console.log("[GitHubCallbackError]: internal server error")
    return new Response("GitHub callback ERROR!", { status: 500 })
  }
  return new Response(null, { status: 302, headers: { Location: "/profile" } })
}
