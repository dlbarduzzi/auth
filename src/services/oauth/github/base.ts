import { createOauthRequest, encodeBasicCredentials } from "@/services/oauth/lib/utils"

const scopes = ["user:email"]

const authEndpoint = "https://github.com/login/oauth/authorize"
const tokenEndpoint = "https://github.com/login/oauth/access_token"

export class GitHub {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly initialRedirectURI: URL

  constructor(clientId: string, clientSecret: string, initialRedirectURI: URL) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.initialRedirectURI = initialRedirectURI
  }

  private redirectURI(next: string) {
    this.initialRedirectURI.searchParams.set("next", next)
    return this.initialRedirectURI.toString()
  }

  public createAuthorizationURL(state: string, next: "sign-in" | "sign-up") {
    const url = new URL(authEndpoint)
    url.searchParams.set("state", state)
    url.searchParams.set("scope", scopes.join(" "))
    url.searchParams.set("client_id", this.clientId)
    url.searchParams.set("redirect_uri", this.redirectURI(next))
    url.searchParams.set("response_type", "code")
    return url.toString()
  }

  public createTokenRequest(code: string) {
    const body = new URLSearchParams()
    body.set("code", code)
    body.set("grant_type", "authorization_code")
    body.set("redirect_uri", this.initialRedirectURI.toString())
    const request = createOauthRequest(tokenEndpoint, body)
    const credentials = encodeBasicCredentials(this.clientId, this.clientSecret)
    request.headers.set("Authorization", `Basic ${credentials}`)
    return request
  }
}
