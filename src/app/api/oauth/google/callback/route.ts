import { cookies } from "next/headers"

import { google } from "@/services/auth/client"
import { COOKIE_NAMES } from "@/services/auth/vars"
import { redirectOnError } from "@/services/auth/utils"
import { OAuthRequestError } from "@/services/auth/error"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = await getCodeParameter(url)
    const codeVerifier = await getCodeVerifierParameter()

    const tokens = await google.validateAuthorizationCode(code, codeVerifier)
    const googleUser = google.getUserInformation(tokens.idToken)

    return Response.json(
      { id: googleUser.sub, name: googleUser.name, provider: "google" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof OAuthRequestError) {
      return redirectOnError(error.cause, "google")
    }
    console.error(error)
    return redirectOnError("InternalServerError", "google")
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
  const storedState = cookieStore.get(COOKIE_NAMES.GOOGLE_STATE)?.value ?? null
  if (storedState == null) {
    throw new OAuthRequestError("StoredStateNotFound")
  }
  if (state !== storedState) {
    throw new OAuthRequestError("StatesNotMatched")
  }
  return code
}

async function getCodeVerifierParameter() {
  const cookieStore = await cookies()
  const codeVerifier = cookieStore.get(COOKIE_NAMES.GOOGLE_CODE_VERIFIER)?.value ?? null
  if (codeVerifier == null) {
    throw new OAuthRequestError("CodeVerifierNotFound")
  }
  return codeVerifier
}
