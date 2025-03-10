import { cookies } from "next/headers"

import { github } from "@/services/auth/client"
import { COOKIE_NAMES } from "@/services/auth/vars"
import { redirectOnError } from "@/services/auth/utils"
import { OAuthRequestError } from "@/services/auth/error"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = await getCodeParameter(url)
    const token = await github.validateAuthorizationCode(code)
    const githubUser = await github.getUserInformation(token)

    return Response.json(
      { id: githubUser.id, name: githubUser.name, provider: "github" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof OAuthRequestError) {
      return redirectOnError(error.cause, "google")
    }
    console.error(error)
    return redirectOnError("InternalServerError", "github")
  }
}

async function getCodeParameter(url: URL) {
  const code = url.searchParams.get("code")
  if (code == null) {
    throw new OAuthRequestError("CodeNotFound")
  }
  const state = url.searchParams.get("state")
  if (state == null) {
    throw new OAuthRequestError("StateNotFound")
  }
  const cookieStore = await cookies()
  const storedState = cookieStore.get(COOKIE_NAMES.GITHUB_STATE)?.value ?? null
  if (storedState == null) {
    throw new OAuthRequestError("StoredStateNotFound")
  }
  if (state !== storedState) {
    throw new OAuthRequestError("StatesNotMatched")
  }
  return code
}
