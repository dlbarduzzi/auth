import { redirect } from "next/navigation"

import { SignUpForm } from "@/components/signup-form"

import { getSession } from "@/services/auth/actions/sessions"

export default async function Page() {
  const session = await getSession()
  if (session != null) {
    return redirect("/profile")
  }
  return (
    <div>
      <section aria-labelledby="signup-header">
        <h1 id="signup-header" className="sr-only">
          Sign up page.
        </h1>
      </section>
      <div className="p-4">
        <SignUpForm />
      </div>
    </div>
  )
}
