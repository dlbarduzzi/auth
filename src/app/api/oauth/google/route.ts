export async function GET() {
  const authUrl = "/api/oauth/google/callback"
  return new Response(null, { status: 302, headers: { location: authUrl } })
}
