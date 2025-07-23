import { user, session } from "./mock"
import { setSessionCookie } from "@/core/cookie"

const request = new Request("https://example.com")
const headers = request.headers

async function cookieExamples() {
  await setSessionCookie({ user, session }, headers, true)
  console.warn(headers)
}

async function run() {
  await cookieExamples()
}

run()
