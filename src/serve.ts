import { env } from "./core/env"
import { user, session } from "./mock"
import { getCachedCookie, setSessionCookie } from "@/core/cookie"

const request = new Request("https://example.com")
const headers = request.headers

async function cookieExamples() {
  await setSessionCookie({ user, session }, headers)
  console.warn(headers)

  const data = await getCachedCookie(env.AUTH_SECRET, headers)
  console.warn({ data })
}

async function run() {
  await cookieExamples()
}

run()
