// Inspired by pilcrowonpaper/oslo.
// https://github.com/pilcrowonpaper/oslo/blob/main/src/encoding/base64.ts

import type { ArrayNumber } from "./types"

function getAlphabet(isUrlSafe: boolean) {
  return isUrlSafe
    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
}

export function encodeBase64(
  data: string | ArrayBuffer | ArrayNumber,
  padding?: boolean
) {
  const alphabet = getAlphabet(false)
  const buffer =
    typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data)
  return _encodeBase64(buffer, alphabet, padding ?? true)
}

export function decodeBase64(data: string | ArrayBuffer | ArrayNumber) {
  if (typeof data !== "string") {
    data = new TextDecoder().decode(data)
  }
  const isUrlSafe = data.includes("-") || data.includes("_")
  const alphabet = getAlphabet(isUrlSafe)
  return _decodeBase64(data, alphabet)
}

export function encodeBase64url(
  data: string | ArrayBuffer | ArrayNumber,
  padding?: boolean
) {
  const alphabet = getAlphabet(true)
  const buffer =
    typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data)
  return _encodeBase64(buffer, alphabet, padding ?? true)
}

export function decodeBase64url(data: string) {
  const isUrlSafe = data.includes("-") || data.includes("_")
  const alphabet = getAlphabet(isUrlSafe)
  return _decodeBase64(data, alphabet)
}

function _encodeBase64(data: Uint8Array, alphabet: string, padding: boolean): string {
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

function _decodeBase64(data: string, alphabet: string): Uint8Array {
  const decodeMap = new Map<string, number>()
  for (let i = 0; i < alphabet.length; i++) {
    decodeMap.set(alphabet[i]!, i)
  }
  const result: number[] = []
  let buffer = 0
  let bitsCollected = 0

  for (const encoded of data) {
    if (encoded === "=") break
    const value = decodeMap.get(encoded)
    if (value === undefined) {
      throw new Error(`Invalid Base64 character: ${encoded}`)
    }
    buffer = (buffer << 6) | value
    bitsCollected += 6

    if (bitsCollected >= 8) {
      bitsCollected -= 8
      result.push((buffer >> bitsCollected) & 0xff)
    }
  }

  return Uint8Array.from(result)
}
