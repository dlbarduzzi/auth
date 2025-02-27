"use server"

import { cookies } from "next/headers"
import { env } from "@/env/server"

export async function storeStateCookie({
  name,
  state,
}: {
  name: string
  state: string
}) {
  const cookie = await cookies()
  cookie.set(name, state, {
    path: "/",
    maxAge: 60 * 10, // 10 minutes,
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
}
