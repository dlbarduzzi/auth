import { env } from "@/env/client"

type SiteConfig = {
  name: string
  description: string
  url: string
}

export const siteConfig: SiteConfig = {
  name: "Auth",
  description:
    "A custom auth application with support for credentials and oauth features.",
  url: env.NEXT_PUBLIC_APP_URL,
}
