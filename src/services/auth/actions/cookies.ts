"use server"

import { cookies } from "next/headers"

import { env } from "@/env/server"
import { COOKIE_NAMES } from "@/services/auth/cookies"

export async function getSessionCookie() {
  const cookieStore = await cookies()

  let cookieName = `${COOKIE_NAMES.PREFIX}.${COOKIE_NAMES.SESSION_TOKEN}`
  const isProduction = env.NODE_ENV === "production"

  if (isProduction) {
    cookieName = `__Secure-${cookieName}`
  }

  const sessionToken = cookieStore.get(cookieName)?.value ?? null
  if (sessionToken == null) {
    return null
  }

  return sessionToken
}
