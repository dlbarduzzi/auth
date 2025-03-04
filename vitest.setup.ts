import { like } from "drizzle-orm"
import { afterAll } from "vitest"

import { db } from "@/db/conn"
import { users } from "@/db/schemas/users"

afterAll(async () => {
  await db.delete(users).where(like(users.email, "%@test.com%"))
})
