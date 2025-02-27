import { encodeBase64 } from "./utils"

export function createOauthRequest(url: string, body: URLSearchParams) {
  const request = new Request(url, {
    method: "POST",
    body: new TextEncoder().encode(body.toString()),
  })
  request.headers.set("Accept", "application/json")
  request.headers.set("Content-Type", "application/x-www-form-urlencoded")
  return request
}

export function encodeBasicCredentials(username: string, password: string) {
  const bytes = new TextEncoder().encode(`${username}:${password}`)
  return encodeBase64(bytes)
}
