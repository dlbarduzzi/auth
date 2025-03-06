import crypto from "crypto"

type AlphabetOption = "a-z" | "A-Z" | "0-9" | "-_"

function getAlphabet(option: AlphabetOption): string {
  switch (option) {
    case "a-z":
      return "abcdefghijklmnopqrstuvwxyz"
    case "A-Z":
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    case "0-9":
      return "0123456789"
    case "-_":
      return "-_"
    default:
      throw new Error(`unsupported alphabet option: ${option}`)
  }
}

export function generateRandomString<O extends AlphabetOption>(
  length: number,
  ...options: O[]
) {
  if (length < 1) {
    throw new Error("length must be 1 or higher")
  }

  const alphabet = options.map(getAlphabet).join("")
  if (alphabet.length < 1) {
    throw new Error("no valid options provided for alphabet")
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
