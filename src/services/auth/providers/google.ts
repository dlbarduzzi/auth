import { z } from "zod"
import { decodeJwt } from "jose"

import { sendRequest, createOAuthRequest } from "@/services/auth/request"
import { stringifyZodError, FetchResponseError } from "@/lib/error"
import { generateCodeChallenge, encodeBasicCredentials } from "@/services/auth/utils"

const scopes = ["email", "openid", "profile"]

const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"
const tokenEndpoint = "https://oauth2.googleapis.com/token"

export class Google {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly redirectURI: string

  constructor(clientId: string, clientSecret: string, redirectURI: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectURI = redirectURI
  }

  public async createAuthorizationURL(state: string, codeVerifier: string) {
    const url = new URL(authEndpoint)
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    url.searchParams.set("state", state)
    url.searchParams.set("scope", scopes.join(" "))
    url.searchParams.set("client_id", this.clientId)
    url.searchParams.set("redirect_uri", this.redirectURI)
    url.searchParams.set("response_type", "code")
    url.searchParams.set("code_challenge", codeChallenge)
    url.searchParams.set("code_challenge_method", "S256")
    return url.toString()
  }

  public async validateAuthorizationCode(code: string, codeVerifier: string) {
    const body = new URLSearchParams()
    body.set("code", code)
    body.set("grant_type", "authorization_code")
    body.set("redirect_uri", this.redirectURI)
    body.set("code_verifier", codeVerifier)
    const request = createOAuthRequest(tokenEndpoint, body)
    const credentials = encodeBasicCredentials(this.clientId, this.clientSecret)
    request.headers.set("Authorization", `Basic ${credentials}`)
    return await sendCodeValidation(request)
  }

  public getUserInformation(jwt: string) {
    return sendUserInformation(jwt)
  }
}

async function sendCodeValidation(request: Request) {
  const data = await sendRequest(request)
  const errorResponse = z.object({
    error: z.string(),
    error_description: z.string(),
  })
  const error = errorResponse.safeParse(data)
  if (error.success) {
    throw new FetchResponseError({
      cause: error.data.error,
      details: error.data.error_description,
    })
  }
  const tokenResponse = z.object({
    scope: z.string(),
    id_token: z.string(),
    token_type: z.string(),
    access_token: z.string(),
  })
  const token = tokenResponse.safeParse(data)
  if (!token.success) {
    throw new FetchResponseError({
      cause: "bad token schema response body",
      details: stringifyZodError(token.error),
    })
  }
  return { idToken: token.data.id_token, accessToken: token.data.access_token }
}

function sendUserInformation(jwt: string) {
  let payload: unknown
  try {
    payload = decodeJwt(jwt)
  } catch (e) {
    throw new Error("invalid jwt token", { cause: e })
  }
  const userResponse = z.object({
    sub: z.string(),
    name: z.string(),
    email: z.string(),
    picture: z.string(),
  })
  const user = userResponse.safeParse(payload)
  if (!user.success) {
    throw new FetchResponseError({
      cause: "bad user schema response body",
      details: stringifyZodError(user.error),
    })
  }
  return user.data
}
