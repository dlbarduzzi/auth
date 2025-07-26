import type { UserSchema, SessionSchema } from "@/db/schemas"

import z from "zod"
import { eq } from "drizzle-orm"

import { env } from "./env"
import { newApp } from "./app"
import { hashPassword } from "./password"
import { getCachedCookie, setSessionCookie } from "./cookie"

import { users } from "@/db/schemas"
import { lowercase } from "@/tools/strings"
import { status, toStatusText } from "@/tools/http/status"

const app = newApp()

const loginSchema = z.strictObject({
  email: z
    .email("Not a valid email")
    .trim()
    .min(1, "Email is required"),
  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(undefined),
})

app.post("/login", async ctx => {
  let input: unknown

  try {
    input = await ctx.req.json()
  }
  catch (error) {
    if (error instanceof SyntaxError) {
      return ctx.json(
        {
          ok: false,
          status: toStatusText(status.code.badRequest),
          message: "Invalid JSON request.",
        },
        status.code.badRequest,
      )
    }

    const { cause, stack, message } = error instanceof Error ? error : {
      cause: undefined,
      stack: String(error),
      message: "failed to parse json request",
    }

    ctx.var.logger.error(message, { cause, stack })

    return ctx.json(
      {
        ok: false,
        status: toStatusText(status.code.internalServerError),
        message: "Something went wrong while processing this request.",
      },
      status.code.internalServerError,
    )
  }

  const parsed = loginSchema.safeParse(input)

  if (!parsed.success) {
    return ctx.json(
      {
        ok: false,
        status: toStatusText(status.code.badRequest),
        message: "Invalid JSON payload.",
        details: z.treeifyError(parsed.error).properties,
      },
      status.code.badRequest,
    )
  }

  let user: UserSchema | undefined

  try {
    user = await ctx.var.db.query.users.findFirst({
      where: eq(users.email, lowercase(parsed.data.email)),
    })

    if (user == null) {
      // Hash password for valid and invalid emails to ensure uniform response time
      // and help prevent attackers from detecting valid emails.
      await hashPassword(parsed.data.password)

      return ctx.json(
        {
          ok: false,
          status: toStatusText(status.code.unauthorized),
          message: "Invalid email or password.",
        },
        status.code.unauthorized,
      )
    }
  }
  catch (error) {
    const { cause, stack, message } = error instanceof Error ? error : {
      cause: undefined,
      stack: String(error),
      message: "failed to query user in database",
    }

    ctx.var.logger.error(message, { cause, stack })

    return ctx.json(
      {
        ok: false,
        status: toStatusText(status.code.internalServerError),
        message: "Something went wrong while processing this request.",
      },
      status.code.internalServerError,
    )
  }

  const session: SessionSchema = {
    id: "bfaa7e7d-9e0f-40c9-a16e-d2637ede9d90",
    token: "0xjy1cPv3tkG6czghO1JQN5xLEJeJBeY",
    userId: user.id,
    ipAddress: "",
    userAgent: "",
    expiresAt: new Date(Date.UTC(2025, 6, 20, 12, 10, 15, 900)),
    createdAt: new Date(Date.UTC(2025, 6, 20, 12, 10, 15, 900)),
    updatedAt: new Date(Date.UTC(2025, 6, 20, 12, 10, 15, 900)),
  }

  await setSessionCookie({
    data: { user, session },
    headers: { set: ctx.header, get: ctx.req.raw.headers },
    remember: false,
  })

  return ctx.json(
    {
      ok: true,
      status: toStatusText(status.code.ok),
      message: "User logged in successfully.",
    },
    status.code.ok,
  )
})

app.get("/session", async ctx => {
  const data = await getCachedCookie(env.AUTH_SECRET, ctx.req.raw.headers)
  return ctx.json({
    ok: true,
    status: toStatusText(status.code.ok),
    data,
  }, status.code.ok)
})

export const authRoutes = app
