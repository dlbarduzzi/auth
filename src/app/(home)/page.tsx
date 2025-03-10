import NextLink from "next/link"

import { Button } from "@/components/ui/button"
import { getSession } from "@/services/auth/actions/sessions"

export default async function Page() {
  const session = await getSession()
  return (
    <div>
      <section aria-labelledby="homepage-header">
        <h1 id="homepage-header" className="sr-only">
          Auth Homepage.
        </h1>
      </section>
      <div className="p-4">
        <div className="flex items-center gap-x-3">
          {session ? (
            <Button asChild>
              <NextLink href="/profile">Profile</NextLink>
            </Button>
          ) : (
            <Button asChild>
              <NextLink href="/signup">Sign up</NextLink>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
