"use server"

import crypto from "crypto"
import { redirect } from "next/navigation"

import { github } from "@/services/oauth/providers/github"
import { GITHUB_COOKIE_STATE } from "@/services/oauth/lib/constants"

import { storeStateCookie } from "./cookies"

export async function githubSignIn() {
  const state = crypto.randomBytes(32).toString("hex").normalize()
  await storeStateCookie({ name: GITHUB_COOKIE_STATE, state })

  const url = github.createAuthorizationURL(state)
  redirect(url)
}
