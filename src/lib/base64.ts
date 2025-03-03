// Inspired by pilcrowonpaper/oslo.
// https://github.com/pilcrowonpaper/oslo/blob/main/src/encoding/base64.ts

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

export function encodeBase64Padding(bytes: Uint8Array): string {
  return encodeBase64(bytes, alphabet, true)
}

export function encodeBase64NoPadding(bytes: Uint8Array): string {
  return encodeBase64(bytes, alphabet, false)
}

function encodeBase64(bytes: Uint8Array, alphabet: string, padding: boolean): string {
  let shift = 0
  let buffer = 0
  let result = ""

  for (const byte of bytes) {
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
