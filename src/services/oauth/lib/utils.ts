import type { Provider } from "@/db/schemas/providers"

import { env } from "@/env/client"

export function getRedirectURI(provider: Provider) {
  const redirectURI = new URL(
    `/api/login/${provider}/callback`,
    `${env.NEXT_PUBLIC_APP_URL}`
  )
  return redirectURI.toString()
}

export function encodeBase64(bytes: Uint8Array) {
  return btoa(Array.from(bytes, byte => String.fromCodePoint(byte)).join(""))
}
