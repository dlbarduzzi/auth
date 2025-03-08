// Inspired by pilcrowonpaper/oslo.
// https://github.com/pilcrowonpaper/oslo/blob/main/src/encoding/base64.ts

function getAlphabet(isUrlSafe: boolean) {
  return isUrlSafe
    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
}

export function encodeBase64UrlPadding(data: Uint8Array): string {
  const alphabet = getAlphabet(true)
  return encodeBase64(data, alphabet, true)
}

export function encodeBase64UrlNoPadding(data: Uint8Array): string {
  const alphabet = getAlphabet(true)
  return encodeBase64(data, alphabet, false)
}

function encodeBase64(data: Uint8Array, alphabet: string, padding: boolean): string {
  let shift = 0
  let buffer = 0
  let result = ""

  for (const byte of data) {
    shift += 8
    buffer = (buffer << 8) | byte
    while (shift >= 6) {
      shift -= 6
      result += alphabet[(buffer >> shift) & 0x3f]
    }
  }

  if (shift > 0) {
    result += alphabet[(buffer << (6 - shift)) & 0x3f]
  }

  if (padding) {
    const paddingCount = (4 - (result.length % 4)) % 4
    result += "=".repeat(paddingCount)
  }

  return result
}

export function decodeBase64UrlPadding(data: string | ArrayBuffer) {
  if (typeof data !== "string") {
    data = new TextDecoder().decode(data)
  }
  const isUrlSafe = data.includes("-") || data.includes("_")
  const alphabet = getAlphabet(isUrlSafe)
  return decodeBase64(data, alphabet)
}

export function decodeBase64(data: string, alphabet: string): Uint8Array {
  const decodeMap = new Map<string, number>()
  for (let i = 0; i < alphabet.length; i++) {
    decodeMap.set(alphabet[i]!, i)
  }
  const result: number[] = []
  let buffer = 0
  let chunkCount = 0

  for (const encoded of data) {
    if (encoded === "=") break
    const value = decodeMap.get(encoded)
    if (value === undefined) {
      throw new Error(`Invalid Base64 character: ${encoded}`)
    }
    buffer = (buffer << 6) | value
    chunkCount += 6

    if (chunkCount >= 8) {
      chunkCount -= 8
      result.push((buffer >> chunkCount) & 0xff)
    }
  }

  return Uint8Array.from(result)
}
