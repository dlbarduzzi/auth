"use client"

import NextLink from "next/link"

import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function Page() {
  const searchParams = useSearchParams()

  const error = searchParams.get("error") ?? "undefined"
  const provider = searchParams.get("provider") ?? "undefined"

  return (
    <div className="p-4">
      <div className="border border-gray-200 bg-gray-100 px-4 py-3">
        <div>Error: {error}</div>
        <div>Provider: {provider}</div>
      </div>
      <div className="space-x-3 pt-4">
        <Button asChild>
          <NextLink href="/">Home</NextLink>
        </Button>
        <Button asChild>
          <NextLink href="/signup">Sign up</NextLink>
        </Button>
      </div>
    </div>
  )
}
