import crypto from "crypto"

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

export function generateRandomString(length: number) {
  if (length < 1) {
    throw new Error("length must be 1 or higher")
  }

  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  let result = ""
  const alphabetLength = alphabet.length

  for (let i = 0; i < length; i++) {
    const index = randomValues[i]! % alphabetLength
    result += alphabet[index]
  }

  return result
}
