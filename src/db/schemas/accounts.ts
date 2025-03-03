import { relations } from "drizzle-orm"
import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { users } from "./users"

export const providers = ["github", "google"] as const
export const providerEnum = pgEnum("account_provider", providers)

export type Provider = (typeof providers)[number]

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: providerEnum("provider").notNull(),
    providerId: text("provider_id").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  table => [primaryKey({ columns: [table.provider, table.providerId] })]
)

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))
