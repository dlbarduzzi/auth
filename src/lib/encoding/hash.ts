export async function createHashSHA256Hex(value: string) {
  const data = new TextEncoder().encode(value)
  const buffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(buffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function createHmacSHA256Hash(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  )

  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}
