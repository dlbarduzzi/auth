import z from "zod"
import { relations } from "drizzle-orm"

import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
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
}, table => [uniqueIndex("email_index").on(table.email)])

export const passwords = pgTable("passwords", {
  id: uuid("id").primaryKey().defaultRandom(),
  hash: text("hash").notNull(),
  userId: uuid("user_id")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true })
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}))

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  imageUrl: z.string().nullable(),
  isEmailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// export type UserSchema = typeof users.$inferSelect
export type UserSchema = z.infer<typeof userSchema>

export const sessionSchema = z.object({
  id: z.string(),
  token: z.string(),
  userId: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// export type SessionSchema = typeof sessions.$inferSelect
export type SessionSchema = z.infer<typeof sessionSchema>
