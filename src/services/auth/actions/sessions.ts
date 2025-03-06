"use server"

import postgres from "postgres"

import { db } from "@/db/conn"
import { sessions } from "@/db/schemas/sessions"
import { createHashSHA256Hex } from "@/lib/encoding/hash"

import { getSessionCookie } from "./cookies"

export async function getSession() {
  const token = await getSessionCookie()
  if (token == null) {
    return null
  }
  return "fake-token"
}

export async function createSession(token: string, userId: string) {
  try {
    const sessionId = await createHashSHA256Hex(token)

    const session = await db.transaction(async tx => {
      const [result] = await tx
        .insert(sessions)
        .values({
          userId,
          sessionId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        })
        .returning()

      if (result == null) {
        return tx.rollback()
      }

      return result
    })

    return session
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      // Prevent leaking sensitive data.
      throw new Error(error.message)
    }
    throw error
  }
}
