"use client"

import { Button } from "@/components/ui/button"

import { deleteSession } from "@/services/auth/actions/sessions"
import { deleteSessionCookie } from "@/services/auth/actions/cookies"

type SignOutButtonProps = {
  sessionId: string
}

export function SignOutButton({ sessionId }: SignOutButtonProps) {
  async function signOut() {
    await deleteSession(sessionId)
    await deleteSessionCookie()
  }
  return (
    <Button type="button" onClick={signOut}>
      Sign out
    </Button>
  )
}
