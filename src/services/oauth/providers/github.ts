import { z } from "zod"

import {
  createOauthRequest,
  encodeBasicCredentials,
} from "@/services/oauth/lib/requests"

import { env } from "@/env/server"
import { getRedirectURI } from "@/services/oauth/lib/utils"

const scopes = ["user:email"]

const oauthEndpoint = "https://github.com/login/oauth/authorize"
const tokenEndpoint = "https://github.com/login/oauth/access_token"

const tokenSchema = z.object({
  token_type: z.string(),
  access_token: z.string(),
})

export class Github {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly redirectURI: string

  constructor({
    clientId,
    clientSecret,
    redirectURI,
  }: {
    clientId: string
    clientSecret: string
    redirectURI: string
  }) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectURI = redirectURI
  }

  public createAuthorizationURL(state: string) {
    const url = new URL(oauthEndpoint)
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

    const request = createOauthRequest(tokenEndpoint, body)
    const encodedCredentials = encodeBasicCredentials(this.clientId, this.clientSecret)

    request.headers.set("Authorization", `Basic ${encodedCredentials}`)

    const token = await getAccessToken(request)
    return token
  }
}

async function getAccessToken(request: Request) {
  const resp = await fetch(request)
  if (!resp.ok) {
    throw new UnexpectedError(resp.status)
  }

  const data = await resp.json()

  const parsed = tokenSchema.safeParse(data)
  if (!parsed.success) {
    throw new InvalidTokenError(parsed.error)
  }

  return parsed.data.access_token
}

export class UnexpectedError extends Error {
  public status: number

  constructor(status: number) {
    super("Unexpected error")
    this.name = "UnexpectedError"
    this.status = status
  }
}

export class InvalidStateError extends Error {
  constructor() {
    super("Invalid state")
    this.name = "InvalidStateError"
  }
}

export class InvalidTokenError extends Error {
  constructor(zodError: z.ZodError) {
    super("Invalid token")
    this.name = "InvalidTokenError"
    this.cause = JSON.stringify(zodError.flatten().fieldErrors)
  }
}

export const github = new Github({
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  redirectURI: getRedirectURI("github"),
})
