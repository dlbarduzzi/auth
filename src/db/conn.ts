import postgres from "postgres"

import { drizzle } from "drizzle-orm/postgres-js"

import { env } from "@/env/server"

import { users, userRelations } from "./schemas/users"
import { sessions, sessionRelations } from "./schemas/sessions"
import { accounts, accountRelations } from "./schemas/accounts"
import { passwords, passwordRelations } from "./schemas/passwords"

export const client = postgres(env.DATABASE_URL, { max: undefined })

export const db = drizzle({
  client,
  schema: {
    users,
    sessions,
    accounts,
    passwords,
    userRelations,
    sessionRelations,
    accountRelations,
    passwordRelations,
  },
})
