import type { UserSchema, SessionSchema } from "@/db/schemas"

import z from "zod"

import { status } from "@/tools/http/status"

import { env } from "./env"
import { newApp } from "./app"
import { getJsonInput } from "./request"
import { getCachedCookie, setSessionCookie } from "./cookie"
import { sendBadRequest, sendInternalServerError } from "./response"

const app = newApp()

const user: UserSchema = {
  id: "92728623-8bbf-4dcf-a5ce-6734d33ac56a",
  email: "test@email.com",
  imageUrl: "",
  isEmailVerified: false,
  createdAt: new Date(Date.UTC(2025, 6, 20, 10, 30, 15, 300)),
  updatedAt: new Date(Date.UTC(2025, 6, 20, 10, 30, 15, 300)),
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

const INVALID_JSON_REQUEST = "Invalid JSON request."
const INVALID_JSON_PAYLOAD = "Invalid JSON payload."

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
  const input = await getJsonInput(ctx.req)

  switch (input.code) {
    case status.code.badRequest:
      return sendBadRequest(INVALID_JSON_REQUEST)
    case status.code.internalServerError:
      return sendInternalServerError(ctx, input.error)
  }

  const parsed = loginSchema.safeParse(input.data)
  if (!parsed.success) {
    return sendBadRequest(INVALID_JSON_PAYLOAD, z.treeifyError(parsed.error).properties)
  }

  await setSessionCookie({
    data: { user, session },
    headers: { set: ctx.header, get: ctx.req.raw.headers },
    remember: false,
  })
  return ctx.json({ ok: "Cool login" })
})

app.get("/session", async ctx => {
  const data = await getCachedCookie(env.AUTH_SECRET, ctx.req.raw.headers)
  return ctx.json({ ok: "Cool session", data })
})

export const authRoutes = app
