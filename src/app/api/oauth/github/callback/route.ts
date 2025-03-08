import type { OAuthError } from "@/services/auth/vars"

import { cookies } from "next/headers"

import { github } from "@/services/auth/client"
import { COOKIE_NAMES } from "@/services/auth/vars"
import { redirectOnError } from "@/services/auth/request"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const data = await getCodeParameter(url)
    if (!data.ok) {
      return redirectOnError(data.error, "github")
    }

    const token = await github.validateAuthorizationCode(data.code)
    const githubUser = await github.getUserInformation(token)

    return Response.json(
      { id: githubUser.id, name: githubUser.name, provider: "github" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return redirectOnError("InternalServerError", "github")
  }
}

type CodeParameter = { ok: true; code: string } | { ok: false; error: OAuthError }

async function getCodeParameter(url: URL): Promise<CodeParameter> {
  const code = url.searchParams.get("code")
  if (code == null) {
    return { ok: false, error: "CodeNotFound" }
  }
  const state = url.searchParams.get("state")
  if (state == null) {
    return { ok: false, error: "StateNotFound" }
  }
  const cookieStore = await cookies()
  const storedState = cookieStore.get(COOKIE_NAMES.GITHUB_STATE)?.value ?? null
  if (storedState == null) {
    return { ok: false, error: "StoredStateNotFound" }
  }
  if (state !== storedState) {
    return { ok: false, error: "StatesNotMatched" }
  }
  return { ok: true, code }
}
