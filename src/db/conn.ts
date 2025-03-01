import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"

import { env } from "@/env/server"
import { users, accounts } from "./schemas/users"

export const client = postgres(env.DATABASE_URL, { max: undefined })

export const db = drizzle({
  client,
  schema: { users, accounts },
})
