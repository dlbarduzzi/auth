export async function GET() {
  const authUrl = "/api/oauth/github/callback"
  return new Response(null, { status: 302, headers: { location: authUrl } })
}
