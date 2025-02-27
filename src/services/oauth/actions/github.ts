"use server"

import crypto from "crypto"
import { redirect } from "next/navigation"

import { storeStateCookie } from "./cookies"

import { env as clientEnv } from "@/env/client"
import { env as serverEnv } from "@/env/server"

import { Github } from "@/services/oauth/providers/github"
import { OAUTH_CALLBACK_PATH } from "@/services/oauth/lib/constants"

const redirectURI = new URL(
  `${OAUTH_CALLBACK_PATH}/github`,
  `${clientEnv.NEXT_PUBLIC_APP_URL}`
)

export async function githubSignIn() {
  const github = new Github({
    clientId: serverEnv.GITHUB_CLIENT_ID,
    clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    redirectURI: redirectURI.toString(),
  })

  const state = crypto.randomBytes(32).toString("hex").normalize()
  await storeStateCookie({ name: "github_oauth_state", state })

  const url = github.createAuthorizationURL(state)
  redirect(url)
}
