type Cookie = Map<string, string>

function parse({ name, cookie }: { name?: string, cookie: string }): Cookie {
  const parsedCookie: Cookie = new Map()

  if (name && !cookie.includes(name)) {
    return parsedCookie
  }

  const pairs = cookie.trim().split(";")

  for (let pair of pairs) {
    pair = pair.trim()

    const index = pair.indexOf("=")
    if (index < 0) {
      continue
    }

    const cookieName = pair.substring(0, index).trim()
    if (name && name !== cookieName) {
      continue
    }

    const cookieValue = pair.substring(index + 1).trim()
    parsedCookie.set(cookieName, decodeURIComponent(cookieValue))

    if (name) {
      return parsedCookie
    }
  }

  return parsedCookie
}

export function cookie(cookie: string) {
  return {
    getAll: () => {
      return parse({ cookie })
    },
    getOne: (name: string) => {
      return parse({ name, cookie })
    },
  }
}
