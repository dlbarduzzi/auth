import { redirect } from "next/navigation"

import { SignOutButton } from "@/components/signout-button"

import { capitalize } from "@/lib/utils"
import { getSession } from "@/services/auth/actions/sessions"

export default async function Page() {
  const session = await getSession()
  if (session == null) {
    return redirect("/")
  }
  return (
    <div>
      <section aria-labelledby="profile-header">
        <h1 id="profile-header" className="sr-only">
          User profile.
        </h1>
      </section>
      <div>
        <div className="border-b border-b-gray-200 px-4 py-6">
          <h1>Account Settings</h1>
        </div>
        <div className="px-4 pt-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <span className="block text-black">{session.user.email}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Image url</span>
              <span className="block text-black">
                {session.user.imageUrl ?? "Not provided"}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Is email verified?</span>
              <span className="block text-black">
                {capitalize(session.user.isEmailVerified.toString())}
              </span>
            </div>
          </div>
          <div className="pt-6">
            <SignOutButton sessionId={session.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
