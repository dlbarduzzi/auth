"use client"

import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export function SignUpForm() {
  return (
    <div>
      <div>
        <Button asChild>
          <NextLink href="/api/oauth/github">Sign up with Github</NextLink>
        </Button>
      </div>
    </div>
  )
}
