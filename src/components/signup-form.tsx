"use client"

import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export function SignUpForm() {
  return (
    <div className="space-x-3">
      <Button asChild>
        <NextLink href="/api/oauth/github">GitHub</NextLink>
      </Button>
      <Button asChild>
        <NextLink href="/api/oauth/google">Google</NextLink>
      </Button>
    </div>
  )
}
