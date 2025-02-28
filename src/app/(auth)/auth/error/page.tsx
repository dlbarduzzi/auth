import NextLink from "next/link"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <div>
      <section aria-labelledby="auth-error-header">
        <h1 id="auth-error-header" className="sr-only">
          Auth Error Homepage.
        </h1>
      </section>
      <div className="p-4">
        <div
          className={cn(
            "max-w-fit bg-red-100 px-3 py-2 text-sm font-medium text-red-600",
            "ring-1 ring-inset ring-red-600"
          )}
        >
          An error occurred! Please try again.
        </div>
        <div className="flex items-center gap-x-3 pt-4">
          <Button variant="neutral" asChild>
            <NextLink href="/sign-in">Sign in</NextLink>
          </Button>
          <Button asChild>
            <NextLink href="/sign-up">Sign up</NextLink>
          </Button>
        </div>
      </div>
    </div>
  )
}
