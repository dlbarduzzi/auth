import { FetchRequestError, FetchResponseError } from "@/lib/error"

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

export async function sendRequest(request: Request) {
  let response: Response
  try {
    response = await fetch(request)
  } catch (e) {
    throw new FetchRequestError(e)
  }
  if (response.status !== 200) {
    throw new FetchResponseError({
      cause: response.statusText,
      status: response.status,
    })
  }
  let data: unknown
  try {
    data = await response.json()
  } catch (e) {
    throw new FetchResponseError({ cause: e, status: response.status })
  }
  return data
}
