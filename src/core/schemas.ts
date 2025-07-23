import z from "zod"

const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  createdAt: z.date(),
})

const sessionSchema = z.object({
  id: z.string(),
  token: z.string(),
  userId: z.string(),
  createdAt: z.date(),
})

type UserSchema = z.infer<typeof userSchema>
type SessionSchema = z.infer<typeof sessionSchema>

export {
  sessionSchema,
  type SessionSchema,
  userSchema,
  type UserSchema,
}
