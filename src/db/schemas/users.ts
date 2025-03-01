import { relations } from "drizzle-orm"

import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { lower } from "@/db/helpers"

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  table => [uniqueIndex("email_index").on(lower(table.email))]
)

export const accountProviders = ["github"] as const
export const accountProviderEnum = pgEnum("account_provider", accountProviders)

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: accountProviderEnum("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  table => [primaryKey({ columns: [table.provider, table.providerAccountId] })]
)

export const userAccountRelation = relations(users, ({ many }) => ({
  userAccounts: many(accounts),
}))

export const accountUserRelation = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export type AccountProvider = (typeof accountProviders)[number]
