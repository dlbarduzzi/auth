import type { AccountProvider } from "@/db/schemas/users"

import postgres from "postgres"

import { z } from "zod"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

import { db } from "@/db/conn"
import { DatabaseError } from "@/db/helpers"
import { accounts, users } from "@/db/schemas/users"

import { github } from "@/services/oauth/github/client"
import { findUserByEmail, findUserById } from "@/services/oauth/actions/users"
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

    const userAccount = await connectUserAccount(
      githubUserEmail.email,
      githubUser.avatar_url,
      "github",
      githubUser.id.toString()
    )

    if (userAccount == null) {
      console.log("Maybe an error happened?")
    } else if (userAccount === "AUTHENTICATE_USER_WITH_SESSION") {
      console.log("User exists. We need to authenticate it.")
    } else if (userAccount === "SHOULD_UPDATE_USER_EMAIL") {
      console.log("Account exists. We need to update user email.")
    } else {
      console.log(`New user created with ${userAccount.newUser.id}`)
    }

    return new Response(null, { status: 302, headers: { Location: "/" } })
  } catch (error) {
    console.log(error)
    return new Response(null, {
      status: 302,
      headers: { Location: "/auth/error?provider=github&status=InternalServerError" },
    })
  }
}

async function connectUserAccount(
  email: string,
  imageUrl: string,
  provider: AccountProvider,
  providerAccountId: string
) {
  const user = await findUserByEmail(email)

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, providerAccountId),
    columns: { userId: true, provider: true, providerAccountId: true },
  })

  if (user == null && account == null) {
    return await createUserAccount(email, imageUrl, provider, providerAccountId)
  }

  if (user == null && account != null) {
    const userAccount = await findUserById(account.userId)

    if (userAccount == null) {
      throw new DatabaseError(
        "Provider account should not exist without an user",
        `Provider account with user id ${account.userId} found without an user`
      )
    }

    return "SHOULD_UPDATE_USER_EMAIL"
  }

  return "AUTHENTICATE_USER_WITH_SESSION"
}

async function createUserAccount(
  email: string,
  imageUrl: string,
  provider: AccountProvider,
  providerAccountId: string
) {
  return await db.transaction(async tx => {
    try {
      const [newUser] = await tx
        .insert(users)
        .values({ email, imageUrl })
        .returning({ id: users.id, email: users.email })

      if (newUser == null) {
        tx.rollback()
        return
      }

      const [newAccount] = await tx
        .insert(accounts)
        .values({ userId: newUser.id, provider, providerAccountId })
        .returning({
          userId: accounts.userId,
          provider: accounts.provider,
          providerAccountId: accounts.providerAccountId,
        })

      if (newAccount == null) {
        tx.rollback()
        return
      }

      return { newUser, newAccount }
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        throw new DatabaseError(
          error.message,
          "database query to create user and account failed"
        )
      }
      throw error
    }
  })
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
