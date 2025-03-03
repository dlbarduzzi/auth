import type { AccountProvider } from "@/db/schemas/users"

import { z } from "zod"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

import { db } from "@/db/conn"
import { accounts } from "@/db/schemas/users"
import { DatabaseError } from "@/db/helpers"

import { github } from "@/services/oauth/github/client"
import {
  updateUser,
  findUserById,
  findUserByEmail,
  createUserAccount,
} from "@/services/oauth/actions/users"
import { GITHUB_COOKIE_STATE } from "@/services/oauth/github/constants"

import { stringifyZodError } from "@/services/oauth/lib/utils"

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
          Location: createAuthorizationErrorURL("github", "PrimaryUserEmailNotFound"),
        },
      })
    }

    if (!githubUserEmail.verified) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: createAuthorizationErrorURL("github", "UserEmailNotVerified"),
        },
      })
    }

    const userAccount = await connectUserAccount(
      githubUserEmail.email,
      githubUser.avatar_url,
      "github",
      githubUser.id.toString()
    )

    if (userAccount.status !== "Success") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: createAuthorizationErrorURL("github", userAccount.status),
        },
      })
    }

    console.log({ status: "Success", email: userAccount.user.email })

    return new Response(null, { status: 302, headers: { Location: "/" } })
  } catch (error) {
    console.log(error)
    return new Response(null, {
      status: 302,
      headers: {
        Location: createAuthorizationErrorURL("github", "InternalServerError"),
      },
    })
  }
}

type Status =
  | "InternalServerError"
  | "UserEmailNotVerified"
  | "PrimaryUserEmailNotFound"
  | "AccountProviderDoesNotMatch"

function createAuthorizationErrorURL(provider: AccountProvider, status: Status) {
  return `/auth/error?provider=${provider}&status=${status}`
}

type ConnectUserAccount =
  | {
      status: Status
    }
  | { status: "Success"; user: { id: string; email: string } }

async function connectUserAccount(
  email: string,
  imageUrl: string,
  provider: AccountProvider,
  providerAccountId: string
): Promise<ConnectUserAccount> {
  const user = await findUserByEmail(email)

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, providerAccountId),
    columns: { userId: true, provider: true, providerAccountId: true },
  })

  if (user == null && account == null) {
    const result = await createUserAccount(email, imageUrl, provider, providerAccountId)
    if (result == null) {
      return { status: "InternalServerError" }
    }
    return {
      status: "Success",
      user: { id: result.newUser.id, email: result.newUser.email },
    }
  }

  if (user == null && account != null) {
    const userAccount = await findUserById(account.userId)

    if (userAccount == null) {
      throw new DatabaseError(
        "Provider account should not exist without an user",
        `Provider account with user id ${account.userId} found without an user`
      )
    }

    const updatedEmail = await updateUser(account.userId, email, imageUrl)
    if (updatedEmail == null) {
      return { status: "InternalServerError" }
    }

    return { status: "Success", user: updatedEmail }
  }

  if (user != null && account == null) {
    return { status: "AccountProviderDoesNotMatch" }
  }

  if (user != null && account != null) {
    if (user.id !== account.userId) {
      throw new DatabaseError(
        "User and provider account out of sync",
        `User id ${user.id} and provider user id ${account.userId} should match`
      )
    }
    return { status: "Success", user }
  }

  return { status: "InternalServerError" }
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
