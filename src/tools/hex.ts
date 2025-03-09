export function encodeHex(data: ArrayBuffer | Uint8Array) {
  if (data.byteLength === 0) {
    return ""
  }
  const buffer = new Uint8Array(data)
  let result = ""
  for (const byte of buffer) {
    result += byte.toString(16).padStart(2, "0")
  }
  return result
}
