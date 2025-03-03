"use server"

import type { AccountProvider } from "@/db/schemas/users"

import postgres from "postgres"

import { eq } from "drizzle-orm"

import { db } from "@/db/conn"
import { DatabaseError } from "@/db/helpers"
import { users, accounts } from "@/db/schemas/users"

export async function findUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, email: true, imageUrl: true },
  })
}

export async function findUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
    columns: { id: true, email: true },
  })
}

export async function findAccountByProvider(
  provider: AccountProvider,
  providerAccountId: string
) {
  console.log({ providerAccountId })
  return await db.query.accounts.findFirst({
    // Should include providerAccountId as well.
    where: eq(accounts.provider, provider),
    columns: { userId: true, provider: true, providerAccountId: true },
  })
}

export async function createUserAccount(
  email: string,
  imageUrl: string,
  provider: AccountProvider,
  providerAccountId: string
) {
  return await db.transaction(async tx => {
    try {
      const [newUser] = await tx
        .insert(users)
        .values({ email, imageUrl })
        .returning({ id: users.id, email: users.email })

      if (newUser == null) {
        tx.rollback()
        return
      }

      const [newAccount] = await tx
        .insert(accounts)
        .values({ userId: newUser.id, provider, providerAccountId })
        .returning({
          userId: accounts.userId,
          provider: accounts.provider,
          providerAccountId: accounts.providerAccountId,
        })

      if (newAccount == null) {
        tx.rollback()
        return
      }

      return { newUser, newAccount }
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        throw new DatabaseError(
          error.message,
          "database query to create user and account failed"
        )
      }
      throw error
    }
  })
}

export async function updateUser(userId: string, email: string, imageUrl: string) {
  try {
    return await db.transaction(async tx => {
      const [user] = await tx
        .update(users)
        .set({ email, imageUrl })
        .where(eq(users.id, userId))
        .returning({ id: users.id, email: users.email })

      if (user == null) {
        tx.rollback()
        return
      }

      return user
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new DatabaseError(error.message, "database query to update user failed")
    }
    throw error
  }
}
