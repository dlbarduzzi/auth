import crypto from "crypto"

const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const alphanumericLength = alphanumeric.length

export function createRandomSecret(length: number): string {
  if (length < 1) return ""

  const charArray = new Uint8Array(length)
  crypto.getRandomValues(charArray)

  let result = ""

  for (let i = 0; i < length; i++) {
    const index = charArray[i]! % alphanumericLength
    result += alphanumeric[index]
  }

  return result
}
