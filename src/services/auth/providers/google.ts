import { generateCodeChallenge } from "@/services/auth/utils"

const scopes = ["openid", "profile"]

const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"

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
}
