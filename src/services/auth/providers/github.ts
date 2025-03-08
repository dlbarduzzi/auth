import { z } from "zod"

import { simplifyZodError } from "@/lib/error/zod"
import { createOAuthRequest } from "@/services/auth/request"
import { encodeBasicCredentials } from "@/services/auth/utils"

import {
  AppFetchError,
  AppResponseError,
  AppOAuthRequestError,
  AppResponseBodyError,
} from "@/lib/error"

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
    return await sendUserInformation(token)
  }
}

async function sendCodeValidation(request: Request) {
  let response: Response
  try {
    response = await fetch(request)
  } catch (e) {
    throw new AppFetchError(e)
  }
  if (response.status !== 200) {
    throw new AppResponseError(response.status, response.statusText)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new AppResponseError(response.status, response.statusText)
  }
  const errorResponse = z.object({
    error: z.string(),
    error_description: z.string(),
  })
  const error = errorResponse.safeParse(data)
  if (error.success) {
    throw new AppOAuthRequestError(error.data.error, error.data.error_description)
  }
  const tokenResponse = z.object({
    scope: z.string(),
    token_type: z.string(),
    access_token: z.string(),
  })
  const token = tokenResponse.safeParse(data)
  if (!token.success) {
    throw new AppResponseBodyError(
      "bad token schema response body",
      simplifyZodError(token.error)
    )
  }
  return token.data.access_token
}

async function sendUserInformation(token: string) {
  const request = new Request("https://api.github.com/user")
  request.headers.set("Authorization", `Bearer ${token}`)
  let response: Response
  try {
    response = await fetch(request)
  } catch (e) {
    throw new AppFetchError(e)
  }
  if (response.status !== 200) {
    throw new AppResponseError(response.status, response.statusText)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new AppResponseError(response.status, response.statusText)
  }
  const userResponse = z.object({
    id: z.number(),
    name: z.string(),
    login: z.string(),
    avatar_url: z.string(),
  })
  const user = userResponse.safeParse(data)
  if (!user.success) {
    throw new AppResponseBodyError(
      "bad user schema response body",
      simplifyZodError(user.error)
    )
  }
  return user.data
}
