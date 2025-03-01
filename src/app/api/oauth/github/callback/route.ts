import { z } from "zod"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

import { db } from "@/db/conn"
import { accounts, users } from "@/db/schemas/users"
import { github } from "@/services/oauth/github/client"
import { stringifyZodError } from "@/services/oauth/lib/utils"
import { GITHUB_COOKIE_STATE } from "@/services/oauth/github/constants"

import {
  AppFetchError,
  InvalidRequestError,
  UnexpectedResponseError,
  UnexpectedResponseBodyError,
} from "@/services/oauth/lib/request"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const code = await getCode(url)
    const token = await github.validateAuthorizationCode(code)
    const githubUser = await getGithubUser(token)
    const githubUserEmail = await getGithubUserEmail(token)

    if (githubUserEmail == null) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/error?provider=github&status=PrimaryUserEmailNotFound",
        },
      })
    }

    if (!githubUserEmail.verified) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/auth/error?provider=github&status=UserEmailNotVerified",
        },
      })
    }

    // TODO: Finish implementing this.
    await connectUserAccount(githubUserEmail.email, githubUser.id.toString())

    return new Response(null, { status: 302, headers: { Location: "/" } })
  } catch (error) {
    console.log(error)
    return new Response(null, {
      status: 302,
      headers: { Location: "/auth/error?provider=github&status=InternalServerError" },
    })
  }
}

async function connectUserAccount(email: string, providerAccountId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true, email: true },
  })

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, providerAccountId),
    columns: { userId: true, provider: true, providerAccountId: true },
  })

  if (user == null && account == null) {
    console.log("Should create new user and account...")
  }

  console.log({ user, account })
}

async function getCode(url: URL) {
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const cookie = await cookies()
  const storedState = cookie.get(GITHUB_COOKIE_STATE)?.value ?? null

  if (code == null || state == null || storedState == null) {
    throw new InvalidRequestError("one of code, state, or stored state is missing")
  }

  if (state !== storedState) {
    throw new InvalidRequestError("state and stored state do not match")
  }

  return code
}

async function getGithubUser(token: string) {
  const request = new Request("https://api.github.com/user")
  request.headers.set("Authorization", `Bearer ${token}`)
  let response: Response
  try {
    response = await fetch(request)
  } catch (e) {
    throw new AppFetchError(e)
  }
  if (response.status !== 200) {
    throw new UnexpectedResponseError(response.status)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new UnexpectedResponseError(response.status)
  }
  const userResponse = z.object({
    id: z.number(),
    name: z.string(),
    login: z.string(),
    avatar_url: z.string(),
  })
  const user = userResponse.safeParse(data)
  if (!user.success) {
    throw new UnexpectedResponseBodyError(
      "bad-user-response",
      response.status,
      stringifyZodError(user.error)
    )
  }
  return user.data
}

async function getGithubUserEmail(token: string) {
  const request = new Request("https://api.github.com/user/emails")
  request.headers.set("Authorization", `Bearer ${token}`)
  let response: Response
  try {
    response = await fetch(request)
  } catch (e) {
    throw new AppFetchError(e)
  }
  if (response.status !== 200) {
    throw new UnexpectedResponseError(response.status)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new UnexpectedResponseError(response.status)
  }
  const emailsResponse = z.array(
    z.object({
      email: z.string(),
      primary: z.boolean(),
      verified: z.boolean(),
    })
  )
  const emails = emailsResponse.safeParse(data)
  if (!emails.success) {
    throw new UnexpectedResponseBodyError(
      "bad-user-email-response",
      response.status,
      stringifyZodError(emails.error)
    )
  }
  for (const email of emails.data) {
    if (email.primary) return email
  }
  return null
}
