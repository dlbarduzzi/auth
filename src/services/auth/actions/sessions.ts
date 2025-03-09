"use server"

import postgres from "postgres"

import { eq } from "drizzle-orm"

import { db } from "@/db/conn"
import { env } from "@/env/server"
import { sessions } from "@/db/schemas/sessions"
import { hmacSignSHA256 } from "@/tools/hmac"
import { AppDatabaseError } from "@/lib/error"

import { getSessionCookie } from "./cookies"

const SESSION_RENEW_TIME = 1000 * 60 * 60 * 24 * 3
const SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7

export async function getSession() {
  const token = await getSessionCookie()
  if (token == null) {
    return null
  }

  const sessionId = await hmacSignSHA256(env.AUTH_SECRET, token)

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
        throw new AppDatabaseError(`db failed to update session with id ${session.id}`)
      }
    } catch (error) {
      const details = `[Exception]: db failed to update session with id ${session.id}`
      switch (true) {
        case error instanceof AppDatabaseError:
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
  }

  return session
}

export async function createSession(token: string, userId: string) {
  try {
    const sessionId = await hmacSignSHA256(env.AUTH_SECRET, token)
    const expiresAt = new Date(Date.now() + SESSION_EXPIRE_TIME)

    const session = await db.transaction(async tx => {
      const [result] = await tx
        .insert(sessions)
        .values({ userId, sessionId, expiresAt })
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
      throw new AppDatabaseError(error.message)
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
      throw new AppDatabaseError(`db failed to delete session with id ${sessionId}`)
    }
  } catch (error) {
    const details = `[Exception]: db failed to delete session with id ${sessionId}`
    switch (true) {
      case error instanceof AppDatabaseError:
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
}
