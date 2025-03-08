type Encoding = "utf-8" | "utf-16" | "iso-8859-1"
type BinaryData = ArrayBuffer | ArrayBufferView

const decoders = new Map<Encoding, TextDecoder>()

export function decodeBinary(data: BinaryData, encoding: Encoding = "utf-8") {
  if (!decoders.has(encoding)) {
    decoders.set(encoding, new TextDecoder(encoding))
  }
  const decoder = decoders.get(encoding)!
  return decoder.decode(data)
}
