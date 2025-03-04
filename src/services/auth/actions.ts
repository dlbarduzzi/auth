"use server"

import postgres from "postgres"

import { db } from "@/db/conn"
import { users } from "@/db/schemas/users"

export async function createUser(email: string) {
  try {
    return await db.transaction(async tx => {
      const [newUser] = await tx
        .insert(users)
        .values({ email: email.toLowerCase() })
        .returning({ id: users.id, email: users.email })

      if (newUser == null) {
        tx.rollback()
        return
      }

      return newUser
    })
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      throw new AuthDatabaseError(error.message, "database query to create user failed")
    }
    throw error
  }
}

class AuthDatabaseError extends Error {
  constructor(cause: string, message: string) {
    super(message, { cause })
    this.name = "AuthDatabaseError"
  }
}
