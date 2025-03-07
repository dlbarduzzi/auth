"use server"

import postgres from "postgres"

import { eq } from "drizzle-orm"

import { db } from "@/db/conn"
import { sessions } from "@/db/schemas/sessions"
import { DatabaseError } from "@/services/auth/error"
import { createHashSHA256Hex } from "@/lib/encoding/hash"

import { getSessionCookie } from "./cookies"

const SESSION_RENEW_TIME = 1000 * 60 * 60 * 24 * 3
const SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7

export async function getSession() {
  const token = await getSessionCookie()
  if (token == null) {
    return null
  }

  const sessionId = await createHashSHA256Hex(token)

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.sessionId, sessionId),
    with: { user: true },
  })

  if (session == null) {
    return null
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSession(session.id)
    return null
  }

  if (Date.now() >= session.expiresAt.getTime() - SESSION_RENEW_TIME) {
    session.expiresAt = new Date(Date.now() + SESSION_EXPIRE_TIME)

    try {
      const [result] = await db
        .update(sessions)
        .set({ expiresAt: session.expiresAt })
        .where(eq(sessions.id, session.id))
        .returning({ id: sessions.id })

      if (result == null) {
        throw new DatabaseError(`db failed to update session with id ${session.id}`)
      }
    } catch (error) {
      const details = `[Exception]: db failed to update session with id ${session.id}`
      logError(error, details)
    }
  }

  return session
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
          expiresAt: new Date(Date.now() + SESSION_EXPIRE_TIME),
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
      throw new DatabaseError(error.message)
    }
    throw error
  }
}

export async function deleteSession(sessionId: string) {
  try {
    const [result] = await db
      .delete(sessions)
      .where(eq(sessions.id, sessionId))
      .returning({ id: sessions.id })

    if (result == null) {
      throw new DatabaseError(`db failed to delete session with id ${sessionId}`)
    }
  } catch (error) {
    const details = `[Exception]: db failed to delete session with id ${sessionId}`
    logError(error, details)
  }
}

function logError(error: unknown, details: string) {
  switch (true) {
    case error instanceof DatabaseError:
      console.error(error)
      break
    case error instanceof postgres.PostgresError:
      console.error(`[PostgresError]: ${error.message}`)
      console.error(details)
      break
    default:
      console.error(error)
      console.error(details)
  }
}
