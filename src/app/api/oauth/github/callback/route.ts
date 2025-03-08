import type { OAuthError } from "@/services/auth/vars"

import { cookies } from "next/headers"

import { github } from "@/services/auth/client"
import { COOKIE_NAMES } from "@/services/auth/vars"
import { redirectOnError } from "@/services/auth/request"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const { code, error } = await getCodeParameter(url)
    if (error != null) {
      return redirectOnError(error, "github")
    }

    const token = await github.validateAuthorizationCode(code)
    const githubUser = await github.getUserInformation(token)

    return new Response(`GitHub user: ${githubUser.name}`, { status: 200 })
  } catch (error) {
    console.error(error)
    return redirectOnError("InternalServerError", "github")
  }
}

type CodeParameter = { code: string; error: null } | { code: null; error: OAuthError }

async function getCodeParameter(url: URL): Promise<CodeParameter> {
  const code = url.searchParams.get("code")
  if (code == null) {
    return { code: null, error: "CodeNotFound" }
  }
  const state = url.searchParams.get("state")
  if (state == null) {
    return { code: null, error: "StateNotFound" }
  }
  const cookieStore = await cookies()
  const storedState = cookieStore.get(COOKIE_NAMES.GITHUB_STATE)?.value ?? null
  if (storedState == null) {
    return { code: null, error: "StoredStateNotFound" }
  }
  if (state !== storedState) {
    return { code: null, error: "StatesNotMatched" }
  }
  return { code, error: null }
}
