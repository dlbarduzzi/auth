import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getSession } from "@/services/auth/actions/sessions"

export default async function Page() {
  const session = await getSession()
  if (!session) {
    throw redirect("/")
  }
  return (
    <div>
      <section aria-labelledby="profile-header">
        <h1 id="profile-header" className="sr-only">
          User profile.
        </h1>
      </section>
      <div className="p-4">
        <div className="flex items-center gap-x-3">
          <div>User Profile</div>
          <Button type="button">Sign out</Button>
        </div>
      </div>
    </div>
  )
}
