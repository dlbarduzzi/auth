import type { AppContext } from "./types"

import { env } from "./env"
import { status, toStatusText } from "@/tools/http/status"

const JSON_HEADER = { "Content-Type": "application/json" }

function safeJsonString(obj: object) {
  try {
    return JSON.stringify(obj)
  }
  catch (error) {
    if (env.NODE_ENV === "development") {
      console.error(error)
    }
    else {
      // This should never happen
      return "ERROR: safeJsonString failed"
    }
  }
}

export function sendBadRequest(message: string, errors?: unknown): Response {
  const statusCode = status.code.badRequest
  const statusText = toStatusText(statusCode)

  return new Response(safeJsonString({
    ok: false,
    status: {
      code: statusCode,
      text: statusText,
    },
    details: {
      errors,
      message,
    },
  }), {
    status: statusCode,
    statusText,
    headers: { ...JSON_HEADER },
  })
}

export function sendInternalServerError(ctx: AppContext, error: unknown): Response {
  const statusCode = status.code.internalServerError
  const statusText = toStatusText(statusCode)

  ctx.var.logger.error(error instanceof Error
    ? error.message
    : "uncaught error", {
    path: ctx.req.path,
    method: ctx.req.method,
  })

  if (env.NODE_ENV === "development") {
    console.error(error)
  }

  return new Response(safeJsonString({
    ok: false,
    status: {
      code: statusCode,
      text: statusText,
    },
    details: {
      message: "Something went wrong while processing this request.",
    },
  }), {
    status: statusCode,
    statusText,
    headers: { ...JSON_HEADER },
  })
}
