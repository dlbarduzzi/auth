export async function GET(request: Request) {
  try {
    console.log(request.url)
    return new Response(null, { status: 302, headers: { Location: "/" } })
  } catch (error) {
    console.log(error)
    return new Response(null, { status: 302, headers: { Location: "/auth/error" } })
  }
}
