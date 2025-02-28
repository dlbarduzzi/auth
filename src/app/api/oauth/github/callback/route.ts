export async function GET(request: Request) {
  console.log(request.url)
  return Response.json({ ok: true }, { status: 200 })
}
