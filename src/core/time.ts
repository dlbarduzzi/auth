type TimeFormat = "ms" | "s" | "m" | "h" | "d" | "w" | "y"

export function createTime(value: number, format: TimeFormat) {
  const toMilliseconds = (): number => {
    switch (format) {
      case "ms":
        return value
      case "s":
        return value * 1000
      case "m":
        return value * 1000 * 60
      case "h":
        return value * 1000 * 60 * 60
      case "d":
        return value * 1000 * 60 * 60 * 24
      case "w":
        return value * 1000 * 60 * 60 * 24 * 7
      case "y":
        return value * 1000 * 60 * 60 * 24 * 365
    }
  }
  return {
    toSeconds: () => toMilliseconds() / 1000,
  }
}

export function getDate(span: number, unit: "sec" | "ms" = "ms") {
  return new Date(Date.now() + (unit === "sec" ? span * 1000 : span))
}
