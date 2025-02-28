import { createOauthRequest, encodeBasicCredentials } from "@/services/oauth/lib/utils"

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

  public validateAuthorizationCode(code: string) {
    const body = new URLSearchParams()
    body.set("code", code)
    body.set("grant_type", "authorization_code")
    body.set("redirect_uri", this.redirectURI)
    const request = createOauthRequest(tokenEndpoint, body)
    const credentials = encodeBasicCredentials(this.clientId, this.clientSecret)
    request.headers.set("Authorization", `Basic ${credentials}`)
    return request
  }
}
