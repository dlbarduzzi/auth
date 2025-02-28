import { SignUpForm } from "@/components/sign-up-form"

export default function Page() {
  return (
    <div>
      <section aria-labelledby="sign-up-header">
        <h1 id="sign-up-header" className="sr-only">
          Sign up page.
        </h1>
      </section>
      <div className="p-4">
        <SignUpForm />
      </div>
    </div>
  )
}
