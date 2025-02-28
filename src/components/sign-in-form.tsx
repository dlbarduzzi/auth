"use client"

import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export function SignInForm() {
  return (
    <div>
      <div>
        <Button asChild>
          <NextLink href="/api/sign-in/github">Sign in with Github</NextLink>
        </Button>
      </div>
    </div>
  )
}
