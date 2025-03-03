"use client"

import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export function SignUpForm() {
  return (
    <div>
      <div>
        <Button asChild>
          <NextLink href="/api/oauth/github">GitHub</NextLink>
        </Button>
      </div>
    </div>
  )
}
