"use server"

import type { Provider } from "@/db/schemas/accounts"

import bcrypt from "bcryptjs"
import postgres from "postgres"

import { eq, and } from "drizzle-orm"

import { db } from "@/db/conn"
import { lowercase } from "@/lib/utils"
import { AuthDatabaseError } from "@/lib/error"

import { users } from "@/db/schemas/users"
import { accounts } from "@/db/schemas/accounts"
import { passwords } from "@/db/schemas/passwords"

export async function findUserByEmail(email: string, withPassword: boolean = false) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, lowercase(email)),
      columns: { id: true, email: true, imageUrl: true, isEmailVerified: true },
      with: {
        account: {
          columns: { provider: true, providerId: true },
        },
        password: {
          columns: { id: true, passwordHash: withPassword },
        },
      },
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(error.message, {
        cause: "database query to find user failed",
        caller: "findUserByEmail",
      })
    }
    throw error
  }
}

export async function findAccountByProvider(provider: Provider, providerId: string) {
  try {
    return await db.query.accounts.findFirst({
      where: and(eq(accounts.provider, provider), eq(accounts.providerId, providerId)),
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(error.message, {
        cause: "database query to find account failed",
        caller: "findAccountByProvider",
      })
    }
    throw error
  }
}

export async function createUserWithProvider(
  email: string,
  imageUrl: string,
  provider: Provider,
  providerId: string
) {
  try {
    return await db.transaction(async tx => {
      const [newUser] = await tx
        .insert(users)
        .values({ email: lowercase(email), imageUrl })
        .returning()

      if (newUser == null) {
        tx.rollback()
        return
      }

      const [newAccount] = await tx
        .insert(accounts)
        .values({ userId: newUser.id, provider, providerId })
        .returning()

      if (newAccount == null) {
        tx.rollback()
        return
      }

      return { user: newUser, account: newAccount }
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(error.message, {
        cause: "database query to create user failed",
        caller: "createUserWithAccount",
      })
    }
    throw error
  }
}

export async function createUserWithPassword(email: string, password: string) {
  try {
    return await db.transaction(async tx => {
      const [newUser] = await tx
        .insert(users)
        .values({ email: lowercase(email), isEmailVerified: false })
        .returning({ id: users.id, email: users.email })

      if (newUser == null) {
        tx.rollback()
        return
      }

      const passwordHash = await bcrypt.hash(password, 12)

      const [newPassword] = await tx
        .insert(passwords)
        .values({ userId: newUser.id, passwordHash })
        .returning({ id: passwords.id })

      if (newPassword == null) {
        tx.rollback()
        return
      }

      return newUser
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(error.message, {
        cause: "database query to create user failed",
        caller: "createUserWithPassword",
      })
    }
    throw error
  }
}

export async function deleteUserByEmail(email: string) {
  try {
    return await db.transaction(async tx => {
      const [deletedUser] = await tx
        .delete(users)
        .where(eq(users.email, lowercase(email)))
        .returning({ deletedId: users.id })

      if (deletedUser == null) {
        tx.rollback()
        return
      }

      const userAccount = await tx.query.accounts.findFirst({
        where: eq(accounts.userId, deletedUser.deletedId),
        columns: { userId: true },
      })

      if (userAccount != null) {
        throw new AuthDatabaseError(
          `account for user with id ${deletedUser.deletedId} not deleted`,
          {
            cause: "database query failed to delete user account",
            caller: "deleteUserByEmail",
          }
        )
      }

      const userPassword = await tx.query.passwords.findFirst({
        where: eq(passwords.userId, deletedUser.deletedId),
        columns: { userId: true },
      })

      if (userPassword != null) {
        throw new AuthDatabaseError(
          `password for user with id ${deletedUser.deletedId} not deleted`,
          {
            cause: "database query failed to delete user password",
            caller: "deleteUserByEmail",
          }
        )
      }

      return deletedUser
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(error.message, {
        cause: "database query to delete user failed",
        caller: "deleteUserByEmail",
      })
    }
    throw error
  }
}
