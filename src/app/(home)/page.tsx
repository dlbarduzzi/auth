import NextLink from "next/link"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div>
      <section aria-labelledby="homepage-header">
        <h1 id="homepage-header" className="sr-only">
          Auth Homepage.
        </h1>
      </section>
      <div className="p-4">
        <div className="flex items-center gap-x-3">
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
