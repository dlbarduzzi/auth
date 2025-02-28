import { cookies } from "next/headers"

import { env } from "@/env/server"
import { github } from "@/services/oauth/github/client"
import { InvalidRequestError } from "@/services/oauth/lib/request"
import { GITHUB_COOKIE_STATE } from "@/services/oauth/github/constants"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = await getCode(url)
    const token = await github.validateAuthorizationCode(code)
    if (env.NODE_ENV === "development") {
      console.log({ token })
    }
    return new Response(null, { status: 302, headers: { Location: "/" } })
  } catch (error) {
    console.log(error)
    return new Response(null, { status: 302, headers: { Location: "/auth/error" } })
  }
}

async function getCode(url: URL) {
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const cookie = await cookies()
  const storedState = cookie.get(GITHUB_COOKIE_STATE)?.value ?? null

  if (code == null || state == null || storedState == null) {
    throw new InvalidRequestError("one of code, state, or stored state is missing")
  }

  if (state !== storedState) {
    throw new InvalidRequestError("state and stored state do not match")
  }

  return code
}
