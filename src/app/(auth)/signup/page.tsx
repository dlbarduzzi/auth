import { SignUpForm } from "@/components/signup-form"

export default function Page() {
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
