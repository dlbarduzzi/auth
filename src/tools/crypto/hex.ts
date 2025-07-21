export const hex = {
  encode: (data: ArrayBuffer) => {
    const buffer = new Uint8Array(data)
    const result = Array.from(buffer)
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("")
    return result
  },
}
