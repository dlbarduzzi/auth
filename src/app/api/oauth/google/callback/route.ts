import type { OAuthError } from "@/services/auth/vars"

import { cookies } from "next/headers"

import { google } from "@/services/auth/client"
import { COOKIE_NAMES } from "@/services/auth/vars"
import { redirectOnError } from "@/services/auth/request"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const data = await getCodesParameters(url)
    if (!data.ok) {
      return redirectOnError(data.error, "google")
    }

    const tokens = await google.validateAuthorizationCode(data.code, data.codeVerifier)
    const googleUser = google.getUserInformation(tokens.idToken)

    return Response.json(
      { id: googleUser.sub, name: googleUser.name, provider: "google" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return redirectOnError("InternalServerError", "google")
  }
}

type CodeParameter =
  | { ok: false; error: OAuthError }
  | { ok: true; code: string; codeVerifier: string }

async function getCodesParameters(url: URL): Promise<CodeParameter> {
  const code = url.searchParams.get("code")
  if (code == null) {
    return { ok: false, error: "CodeNotFound" }
  }
  const state = url.searchParams.get("state")
  if (state == null) {
    return { ok: false, error: "StateNotFound" }
  }
  const cookieStore = await cookies()
  const storedState = cookieStore.get(COOKIE_NAMES.GOOGLE_STATE)?.value ?? null
  if (storedState == null) {
    return { ok: false, error: "StoredStateNotFound" }
  }
  if (state !== storedState) {
    return { ok: false, error: "StatesNotMatched" }
  }
  const codeVerifier = cookieStore.get(COOKIE_NAMES.GOOGLE_CODE_VERIFIER)?.value ?? null
  if (codeVerifier == null) {
    return { ok: false, error: "CodeVerifierNotFound" }
  }
  return { ok: true, code, codeVerifier }
}
