import { z } from "zod"
import { relations } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"

import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { accounts } from "./accounts"
import { passwords } from "./passwords"

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    imageUrl: text("image_url"),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  table => [uniqueIndex("email_index").on(table.email)]
)

export const userRelations = relations(users, ({ one }) => ({
  account: one(accounts),
  password: one(passwords),
}))

export const userSchema = createSelectSchema(users)
export type UserSchema = z.infer<typeof userSchema>
