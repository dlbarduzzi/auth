import crypto from "crypto"

import { encodeBase64NoPadding } from "@/lib/base64"

export function generateState() {
  const randomValues = new Uint8Array(32)
  crypto.getRandomValues(randomValues)
  return encodeBase64NoPadding(randomValues)
}
