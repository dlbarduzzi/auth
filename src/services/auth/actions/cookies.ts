"use server"

import { cookies } from "next/headers"

import { env } from "@/env/server"
import { COOKIE_NAMES } from "@/services/auth/vars"

function getSessionCookieName() {
  const cookieName = `${COOKIE_NAMES.PREFIX}.${COOKIE_NAMES.SESSION_TOKEN}`
  const isProduction = env.NODE_ENV === "production"

  if (isProduction) {
    return `__Secure-${cookieName}`
  }

  return cookieName
}

export async function getSessionCookie() {
  const cookieName = getSessionCookieName()
  const cookieStore = await cookies()

  const sessionToken = cookieStore.get(cookieName)?.value ?? null
  if (sessionToken == null) {
    return null
  }

  return sessionToken
}

export async function createSessionCookie(token: string, expires: Date) {
  const cookieName = getSessionCookieName()
  const cookieStore = await cookies()
  cookieStore.set(cookieName, token, {
    path: "/",
    secure: env.NODE_ENV === "production",
    expires,
    httpOnly: true,
    sameSite: "lax",
  })
}

export async function deleteSessionCookie() {
  const cookieName = getSessionCookieName()
  const cookieStore = await cookies()
  cookieStore.set(cookieName, "", {
    path: "/",
    secure: env.NODE_ENV === "production",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  })
}
