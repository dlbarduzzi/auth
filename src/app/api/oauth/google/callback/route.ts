import { getSession } from "@/services/auth/actions/sessions"

export async function GET() {
  if (1 > 0) {
    return new Response("Google callback", { status: 200 })
  }
  const session = await getSession()
  if (session != null) {
    return new Response(null, { status: 302, headers: { location: "/profile" } })
  }
  return new Response("Google callback", { status: 200 })
}
