import { describe, expect, it } from "vitest"

import { lowercase } from "@/lib/utils"

import {
  findUserByEmail,
  deleteUserByEmail,
  findAccountByProvider,
  createUserWithPassword,
  createUserWithProvider,
} from "./users"

describe("users with provider", () => {
  const email = "users.username@test.com"
  const imageUrl = "https://placeholder.com"
  const provider = "github"
  const providerId = "users_gh_ABC"

  it("should create user with provider", async () => {
    const result = await createUserWithProvider(email, imageUrl, provider, providerId)

    if (result == null) {
      throw new Error(`expected result for user with email ${email} to be defined`)
    }

    expect(result).toHaveProperty("user")
    expect(result).toHaveProperty("account")

    const { user, account } = result

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(account).toHaveProperty("userId")
    expect(account).toHaveProperty("provider")
    expect(user.id).toEqual(account.userId)
  })

  it("should find user by provider", async () => {
    const account = await findAccountByProvider(provider, providerId)

    if (account == null) {
      throw new Error(`expected account for user with email ${email} to be defined`)
    }

    expect(account).toHaveProperty("userId")
    expect(account).toHaveProperty("provider")
    expect(account.provider).toEqual(provider)
  })

  it("should delete user by email", async () => {
    const user = await deleteUserByEmail(email)

    if (user == null) {
      throw new Error(`expected deleted user with email ${email} to be defined`)
    }

    expect(user).toHaveProperty("deletedId")
  })
})

describe("users with password", () => {
  const email = "users.username@test.com"
  const password = "password"

  it("should create user with password", async () => {
    const user = await createUserWithPassword(email, password)

    if (user == null) {
      throw new Error(`expected created user with email ${email} to be defined`)
    }

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(user.email).toBe(lowercase(email))
  })

  it("should find user by email without password hash", async () => {
    const user = await findUserByEmail(email)

    if (user == null) {
      throw new Error(`expected user with email ${email} to be defined`)
    }

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(user).toHaveProperty("password")
    expect(user.password).not.toHaveProperty("passwordHash")
  })

  it("should find user by email with password hash", async () => {
    const user = await findUserByEmail(email, true)

    if (user == null) {
      throw new Error(`expected user with email ${email} to be defined`)
    }

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(user).toHaveProperty("password")
    expect(user.password).toHaveProperty("passwordHash")
  })

  it("should delete user by email", async () => {
    const user = await deleteUserByEmail(email)

    if (user == null) {
      throw new Error(`expected deleted user with email ${email} to be defined`)
    }

    expect(user).toHaveProperty("deletedId")
  })
})
