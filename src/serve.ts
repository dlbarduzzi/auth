import { generateId } from "@/core/security"
import { setCookie, setSignedCookie } from "@/core/cookie"

const AUTH_SECRET = "testing-auth-secret"

async function setCookieExamples() {
  const request = new Request("https://example.com")
  const headers = request.headers

  const token = generateId(32)
  console.warn({ token })

  setCookie({
    name: "not_signed_session",
    value: "testing-not-signed-session-12345678",
    options: {
      secure: false,
      maxAge: 300,
    },
    headers,
  })

  await setSignedCookie(AUTH_SECRET, {
    name: "signed_session",
    value: "testing-signed-session-12345678",
    headers,
    options: {
      secure: true,
      maxAge: 900,
    },
  })

  console.warn(headers)
}

async function run() {
  await setCookieExamples()
}

run()
