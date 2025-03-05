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
