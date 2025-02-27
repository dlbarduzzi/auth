"use client"

import { Button } from "@/components/ui/button"

import { githubSignIn } from "@/services/oauth/actions/github"

export function SignUpForm() {
  async function githubSignUp() {
    console.log("Github signup...")
    const resp = await githubSignIn()
    console.log(resp)
  }
  return (
    <div>
      <div>
        <Button type="button" onClick={githubSignUp}>
          Sign up with Github
        </Button>
      </div>
    </div>
  )
}
