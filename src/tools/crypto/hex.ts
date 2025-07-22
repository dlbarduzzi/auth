import type { TypedArray } from "./types"

export const hex = {
  encode: (data: string | ArrayBuffer | TypedArray) => {
    const value = typeof data === "string"
      ? new TextEncoder().encode(data)
      : data
    if (value.byteLength === 0) {
      return ""
    }
    const bytes = new Uint8Array(value)
    const result = Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("")
    return result
  },
  decode: (data: string, format: "bytes" | "string" = "string") => {
    if (!data) {
      return ""
    }
    if (data.length % 2 !== 0) {
      throw new Error("Invalid hexadecimal string")
    }
    if (!/^[0-9a-f]+$/.test(data)) {
      throw new Error("Invalid hexadecimal string")
    }
    const result = new Uint8Array(data.length / 2)
    for (let i = 0; i < data.length; i += 2) {
      result[i / 2] = Number.parseInt(data.slice(i, i + 2), 16)
    }
    if (format === "bytes") {
      return result
    }
    return new TextDecoder().decode(result)
  },
}
