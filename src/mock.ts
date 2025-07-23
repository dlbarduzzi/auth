import type { UserSchema, SessionSchema } from "@/core/schemas"

const user: UserSchema = {
  id: "92728623-8bbf-4dcf-a5ce-6734d33ac56a",
  email: "test@email.com",
  createdAt: new Date(Date.UTC(2025, 6, 20, 10, 30, 15, 300)),
}

const session: SessionSchema = {
  id: "bfaa7e7d-9e0f-40c9-a16e-d2637ede9d90",
  token: "0xjy1cPv3tkG6czghO1JQN5xLEJeJBeY",
  userId: user.id,
  createdAt: new Date(Date.UTC(2025, 6, 20, 12, 10, 15, 900)),
}

export { session, user }
