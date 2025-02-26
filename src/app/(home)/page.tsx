import { Button } from "@/components/ui/button"
import { ButtonSpinner } from "@/components/button-spinner"

export default function Page() {
  return (
    <div>
      <section aria-labelledby="homepage-header">
        <h1 id="homepage-header" className="sr-only">
          Auth Homepage.
        </h1>
      </section>
      <div className="max-w-2xl space-y-4 p-4">
        <div className="border border-gray-200 px-5 py-4">
          <h1 className="font-bold">Fun Fact</h1>
          <p className="pt-2">
            In the United States, a person must be at least 35 to be President or Vice
            President, 30 to be a Senator, or 25 to be a Representative, as specified in
            the U.S. Constitution. Most states in the U.S. also have age requirements
            for the offices of Governor, State Senator, and State Representative.
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="button" disabled={false}>
            Click me
          </Button>
          <Button type="button" variant="neutral" disabled={false}>
            Click me
          </Button>
        </div>
        <div className="flex gap-3">
          <ButtonSpinner />
        </div>
      </div>
    </div>
  )
}
