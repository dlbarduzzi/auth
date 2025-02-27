import { cookies } from "next/headers"

import { GITHUB_COOKIE_STATE } from "@/services/oauth/lib/constants"

import {
  github,
  UnexpectedError,
  InvalidStateError,
  InvalidTokenError,
} from "@/services/oauth/providers/github"

export async function GET(request: Request) {
  try {
    const code = await getCodeParameter(request.url)
    const token = await github.validateAuthorizationCode(code)
    return new Response(null, {
      status: 302,
      headers: { Location: `/sign-up?token=${token.slice(0, 6)}` },
    })
  } catch (error) {
    let errorName = "InternalServerError"

    if (error instanceof InvalidStateError) {
      errorName = error.name
    }

    if (error instanceof InvalidTokenError) {
      errorName = error.name
      console.error(error.cause)
    }

    if (error instanceof UnexpectedError) {
      errorName = error.name
      console.error(error.status)
    }

    if (errorName === "InternalServerError") {
      console.error(error)
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: `/sign-up?oauth-error=${encodeURIComponent(errorName)}`,
      },
    })
  }
}

async function getCodeParameter(requestURL: string) {
  const url = new URL(requestURL)

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const cookie = await cookies()
  const storedState = cookie.get(GITHUB_COOKIE_STATE)?.value ?? null

  if (code == null || state == null || storedState == null) {
    throw new InvalidStateError()
  }

  if (state !== storedState) {
    throw new InvalidStateError()
  }

  return code
}
