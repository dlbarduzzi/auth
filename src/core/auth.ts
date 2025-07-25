import type { UserSchema, SessionSchema } from "@/db/schemas"

import { env } from "./env"
import { newApp } from "./app"

import { createResponse } from "./response"
import { getCachedCookie, setSessionCookie } from "./cookie"

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

app.post("/login", async ctx => {
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

app.get("/test", async () => {
  return createResponse({ ok: true }, 200)
})

export const authRoutes = app
