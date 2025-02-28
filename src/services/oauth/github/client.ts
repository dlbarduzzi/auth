import { env as serverEnv } from "@/env/server"
import { env as clientEnv } from "@/env/client"

import { Github } from "./base"

export const github = new Github(
  serverEnv.GITHUB_CLIENT_ID,
  serverEnv.GITHUB_CLIENT_SECRET,
  new URL("/api/oauth/github/callback", clientEnv.NEXT_PUBLIC_APP_URL).toString()
)
