import { env } from "@/env/client"

type SiteConfig = {
  name: string
  description: string
  url: string
}

export const siteConfig: SiteConfig = {
  name: "Auth",
  description: "An auth app with your custom email and oauth features.",
  url: env.NEXT_PUBLIC_APP_URL,
}
