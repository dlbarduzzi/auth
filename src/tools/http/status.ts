const statusCodes = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  unprocessableEntity: 422,
  internalServerError: 500,
} as const

type StatusCode = typeof statusCodes[keyof typeof statusCodes]

const statusTexts = {
  ok: "Ok",
  created: "Created",
  badRequest: "Bad Request",
  unauthorized: "Unauthorized",
  forbidden: "Forbidden",
  notFound: "Not Found",
  unprocessableEntity: "Unprocessable Entity",
  internalServerError: "Internal Server Error",
} as const

type StatusText = typeof statusTexts[keyof typeof statusTexts]

function getStatusText(code: StatusCode): StatusText | undefined {
  switch (code) {
    case statusCodes.ok:
      return statusTexts.ok
    case statusCodes.created:
      return statusTexts.created
    case statusCodes.badRequest:
      return statusTexts.badRequest
    case statusCodes.unauthorized:
      return statusTexts.unauthorized
    case statusCodes.forbidden:
      return statusTexts.forbidden
    case statusCodes.notFound:
      return statusTexts.notFound
    case statusCodes.unprocessableEntity:
      return statusTexts.unprocessableEntity
    case statusCodes.internalServerError:
      return statusTexts.internalServerError
    default:
      code satisfies never
  }
}

function toStatusText(code: StatusCode) {
  const value = getStatusText(code)
  if (value === undefined) {
    throw new Error(`Invalid status code: ${code}`)
  }
  return value
}

const status = {
  code: { ...statusCodes },
  text: { ...statusTexts },
}

export { status, type StatusCode, toStatusText }
