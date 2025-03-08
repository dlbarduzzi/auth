import type { Provider } from "@/db/schemas/accounts"
import type { OAuthError } from "@/services/auth/vars"

export function createOAuthRequest(url: string, body: URLSearchParams) {
  const request = new Request(url, {
    method: "POST",
    body: new TextEncoder().encode(body.toString()),
  })
  request.headers.set("Accept", "application/json")
  request.headers.set("Content-Type", "application/x-www-form-urlencoded")
  request.headers.set("User-Agent", "auth")
  return request
}

export function redirectOnError(error: OAuthError, provider: Provider) {
  return new Response(null, {
    status: 302,
    headers: { Location: `/auth/error?error=${error}&provider=${provider}` },
  })
}
