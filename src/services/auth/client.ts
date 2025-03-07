import { env as serverEnv } from "@/env/server"
import { env as clientEnv } from "@/env/client"

import { GitHub } from "@/services/auth/providers/github"
import { Google } from "@/services/auth/providers/google"

export const github = new GitHub(
  serverEnv.GITHUB_CLIENT_ID,
  serverEnv.GITHUB_CLIENT_SECRET,
  new URL("/api/oauth/github/callback", clientEnv.NEXT_PUBLIC_APP_URL).toString()
)

export const google = new Google(
  serverEnv.GOOGLE_CLIENT_ID,
  serverEnv.GOOGLE_CLIENT_SECRET,
  new URL("/api/oauth/google/callback", clientEnv.NEXT_PUBLIC_APP_URL).toString()
)
