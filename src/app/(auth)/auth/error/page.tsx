import NextLink from "next/link"

import { z } from "zod"

import { Button } from "@/components/ui/button"

const searchParamsSchema = z.object({
  error: z.string().default("undefined"),
  provider: z.string().default("undefined"),
})

type PageProps = {
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const { error, provider } = searchParamsSchema.parse(params)
  return (
    <div className="p-4">
      <div className="border border-gray-200 bg-gray-100 px-4 py-3">
        <div>Error: {error}</div>
        <div>Provider: {provider}</div>
      </div>
      <div className="space-x-3 pt-4">
        <Button asChild>
          <NextLink href="/">Home</NextLink>
        </Button>
        <Button asChild>
          <NextLink href="/signup">Sign up</NextLink>
        </Button>
      </div>
    </div>
  )
}
