import type { App, AppEnv } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { logger } from "@/core/logger"
import { status, toStatusText } from "@/tools/http/status"

export function newApp() {
  return new Hono<AppEnv>({ strict: false })
}

export function bootstrap(app: App) {
  app.use("*", requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", logger)
    await next()
  })

  app.use("*", async (ctx, next) => {
    await next()
    logger.info(`${ctx.req.method} ${ctx.req.path} ${ctx.res.status}`)
  })

  app.notFound(ctx => {
    return ctx.json(
      {
        ok: false,
        status: toStatusText(status.code.notFound),
        message: "This resource does not exist.",
      },
      status.code.notFound,
    )
  })

  app.onError((err, ctx) => {
    ctx.var.logger.error(err.message, {
      cause: err.cause,
      stack: err.stack,
      status: "STATUS_UNHANDLED_EXCEPTION",
    })
    return ctx.json(
      {
        ok: false,
        status: toStatusText(status.code.internalServerError),
        message: "Something went wrong while processing this request.",
      },
      status.code.internalServerError,
    )
  })
}
