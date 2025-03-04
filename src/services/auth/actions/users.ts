"use server"

import type { Provider } from "@/db/schemas/accounts"

import bcrypt from "bcryptjs"
import postgres from "postgres"

import { eq, and } from "drizzle-orm"

import { db } from "@/db/conn"
import { lowercase } from "@/lib/utils"

import { users } from "@/db/schemas/users"
import { accounts } from "@/db/schemas/accounts"
import { passwords } from "@/db/schemas/passwords"

class AuthDatabaseError extends Error {
  constructor(message: string, cause: string) {
    super(message, { cause })
    this.name = "AuthDatabaseError"
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, lowercase(email)),
      columns: { id: true, email: true },
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(
        error.message,
        "database query to findUserByEmail failed"
      )
    }
    throw error
  }
}

export async function findUserByEmailWithPassword(email: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, lowercase(email)),
      columns: { id: true, email: true },
      with: {
        password: {
          columns: { passwordHash: true },
        },
      },
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(
        error.message,
        "database query to findUserByEmailWithPassword failed"
      )
    }
    throw error
  }
}

export async function findUserByEmailWithAccountAndPassword(email: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, lowercase(email)),
      columns: { id: true, email: true },
      with: {
        account: {
          columns: { userId: true, provider: true, providerId: true },
        },
        password: {
          columns: { userId: true },
        },
      },
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(
        error.message,
        "database query to findUserByEmailWithAccountAndPassword failed"
      )
    }
    throw error
  }
}

export async function findUserByProvider(provider: Provider, providerId: string) {
  try {
    const result = await db.query.accounts.findFirst({
      where: and(eq(accounts.provider, provider), eq(accounts.providerId, providerId)),
      columns: { provider: true },
      with: {
        user: {
          columns: { id: true, email: true },
        },
      },
    })

    if (result == null) {
      return result
    }

    return { user: result.user, account: { provider: result.provider } }
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(
        error.message,
        "database query to findUserByProvider failed"
      )
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
      throw new AuthDatabaseError(
        error.message,
        "database query to createUserWithPassword failed"
      )
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
        .returning({ id: users.id, email: users.email })

      if (newUser == null) {
        tx.rollback()
        return
      }

      const [newAccount] = await tx
        .insert(accounts)
        .values({ userId: newUser.id, provider, providerId })
        .returning({ userId: accounts.userId, provider: accounts.provider })

      if (newAccount == null) {
        tx.rollback()
        return
      }

      return { user: newUser, account: newAccount }
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(
        error.message,
        "database query to createUserWithAccount failed"
      )
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
          `account for user with id ${deletedUser.deletedId} should have been deleted`,
          "database query to deleteUserByEmail failed to delete user account"
        )
      }

      const userPassword = await tx.query.passwords.findFirst({
        where: eq(passwords.userId, deletedUser.deletedId),
        columns: { userId: true },
      })

      if (userPassword != null) {
        throw new AuthDatabaseError(
          `password for user with id ${deletedUser.deletedId} should have been deleted`,
          "database query to deleteUserByEmail failed to delete user password"
        )
      }

      return deletedUser
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(
        error.message,
        "database query to deleteUserByEmail failed"
      )
    }
    throw error
  }
}
