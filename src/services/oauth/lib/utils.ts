import crypto from "crypto"

export function generateState() {
  return crypto.randomBytes(32).toString("hex").normalize()
}

export function encodeBase64(bytes: Uint8Array) {
  return btoa(Array.from(bytes, byte => String.fromCodePoint(byte)).join(""))
}

export function encodeBasicCredentials(username: string, password: string) {
  const bytes = new TextEncoder().encode(`${username}:${password}`)
  return encodeBase64(bytes)
}

export function createOauthRequest(url: string, body: URLSearchParams) {
  const request = new Request(url, {
    method: "POST",
    body: new TextEncoder().encode(body.toString()),
  })
  request.headers.set("Accept", "application/json")
  request.headers.set("Content-Type", "application/x-www-form-urlencoded")
  return request
}
