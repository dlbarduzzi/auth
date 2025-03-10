import { z } from "zod"

import { encodeBasicCredentials } from "@/services/auth/utils"
import { sendRequest, createOAuthRequest } from "@/services/auth/request"
import { stringifyZodError, FetchResponseError } from "@/lib/error"

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
    return await sendCodeValidation(request)
  }

  public async getUserInformation(token: string) {
    const request = new Request("https://api.github.com/user")
    request.headers.set("Authorization", `Bearer ${token}`)
    return await sendUserInformation(request)
  }

  public async getUserEmailInformation(token: string) {
    const request = new Request("https://api.github.com/user/emails")
    request.headers.set("Authorization", `Bearer ${token}`)
    return await sendUserEmailInformation(request)
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
  return token.data.access_token
}

async function sendUserInformation(request: Request) {
  const data = await sendRequest(request)
  const userResponse = z.object({
    id: z.number(),
    name: z.string(),
    login: z.string(),
    avatar_url: z.string(),
  })
  const user = userResponse.safeParse(data)
  if (!user.success) {
    throw new FetchResponseError({
      cause: "bad user schema response body",
      details: stringifyZodError(user.error),
    })
  }
  return user.data
}

async function sendUserEmailInformation(request: Request) {
  const data = await sendRequest(request)
  const emailsResponse = z.array(
    z.object({
      email: z.string(),
      primary: z.boolean(),
      verified: z.boolean(),
    })
  )
  const emails = emailsResponse.safeParse(data)
  if (!emails.success) {
    throw new FetchResponseError({
      cause: "bad user email schema response body",
      details: stringifyZodError(emails.error),
    })
  }
  for (const email of emails.data) {
    if (email.primary) return email
  }
  return null
}
