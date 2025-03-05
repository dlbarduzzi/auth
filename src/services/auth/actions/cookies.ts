"use server"

import { env } from "@/env/server"
import { cookies } from "next/headers"

export async function storeOAuthCookie(name: string, value: string) {
  const cookieStore = await cookies()
  cookieStore.set(name, value, {
    path: "/",
    maxAge: 60 * 10, // 10 minutes,
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
}
