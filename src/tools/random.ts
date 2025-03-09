import { getRandomValues } from "uncrypto"

export type Alphabet = "a-z" | "A-Z" | "0-9" | "-_"

function expandAlphabet(alphabet: Alphabet): string {
  switch (alphabet) {
    case "a-z":
      return "abcdefghijklmnopqrstuvwxyz"
    case "A-Z":
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    case "0-9":
      return "0123456789"
    case "-_":
      return "-_"
    default:
      throw new Error(`Unsupported alphabet: ${alphabet}`)
  }
}

export function generateRandomString(length: number, ...characters: Alphabet[]) {
  if (length < 1) {
    throw new Error("Length must be 1 or higher")
  }

  const alphabet = characters.map(expandAlphabet).join("")
  if (alphabet.length < 1) {
    throw new Error("No valid characters provided for alphabet")
  }

  const randomValues = new Uint8Array(length)
  getRandomValues(randomValues)

  const alphabetLength = alphabet.length

  let result = ""
  for (let i = 0; i < length; i++) {
    const index = randomValues[i]! % alphabetLength
    result += alphabet[index]
  }

  return result
}
