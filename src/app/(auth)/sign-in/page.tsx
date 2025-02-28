import { SignInForm } from "@/components/sign-in-form"

export default function Page() {
  return (
    <div>
      <section aria-labelledby="sign-in-header">
        <h1 id="sign-in-header" className="sr-only">
          Sign in page.
        </h1>
      </section>
      <div className="p-4">
        <SignInForm />
      </div>
    </div>
  )
}
