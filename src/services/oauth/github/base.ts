import { z } from "zod"

import { encodeBasicCredentials, stringifyZodError } from "@/services/oauth/lib/utils"

import {
  AppFetchError,
  OAuthRequestError,
  UnexpectedResponseError,
  UnexpectedResponseBodyError,
  createOAuthRequest,
} from "@/services/oauth/lib/request"

const scopes = ["user:email"]

const authEndpoint = "https://github.com/login/oauth/authorize"
const tokenEndpoint = "https://github.com/login/oauth/access_token"

export class GitHub {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly redirectURI: string

  constructor(clientId: string, clientSecret: string, redirectURI: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectURI = redirectURI
  }

  public createAuthorizationURL(state: string) {
    const url = new URL(authEndpoint)
    url.searchParams.set("state", state)
    url.searchParams.set("scope", scopes.join(" "))
    url.searchParams.set("client_id", this.clientId)
    url.searchParams.set("redirect_uri", this.redirectURI)
    url.searchParams.set("response_type", "code")
    return url.toString()
  }

  public async validateAuthorizationCode(code: string) {
    const body = new URLSearchParams()
    body.set("code", code)
    body.set("grant_type", "authorization_code")
    body.set("redirect_uri", this.redirectURI)
    const request = createOAuthRequest(tokenEndpoint, body)
    const credentials = encodeBasicCredentials(this.clientId, this.clientSecret)
    request.headers.set("Authorization", `Basic ${credentials}`)
    return await sendTokenRequest(request)
  }
}

async function sendTokenRequest(request: Request) {
  let response: Response
  try {
    response = await fetch(request)
  } catch (e) {
    throw new AppFetchError(e)
  }
  if (response.status !== 200) {
    if (response.body !== null) {
      await response.body.cancel()
    }
    throw new UnexpectedResponseError(response.status)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new UnexpectedResponseError(response.status)
  }
  const errorResponse = z.object({
    error: z.string(),
    error_description: z.string(),
  })
  const error = errorResponse.safeParse(data)
  if (error.success) {
    throw new OAuthRequestError(error.data.error, error.data.error_description)
  }
  const tokenResponse = z.object({
    scope: z.string(),
    token_type: z.string(),
    access_token: z.string(),
  })
  const token = tokenResponse.safeParse(data)
  if (!token.success) {
    throw new UnexpectedResponseBodyError(
      "bad-token-response",
      response.status,
      stringifyZodError(token.error)
    )
  }
  return token.data.access_token
}
