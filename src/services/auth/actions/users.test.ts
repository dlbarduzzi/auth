import { describe, expect, it } from "vitest"

import { lowercase } from "@/lib/utils"

import {
  findUserByEmail,
  deleteUserByEmail,
  findUserByProvider,
  createUserWithPassword,
  createUserWithProvider,
} from "./users"

describe("users credentials", () => {
  const userEmail = "username@test.com"
  const userPassword = "password"

  it("should create user with password", async () => {
    const user = await createUserWithPassword(userEmail, userPassword)

    if (user == null) {
      throw new Error(`expected created user with email ${userEmail} to be defined`)
    }

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(user.email).toBe(lowercase(userEmail))
  })

  it("should find user by email without password hash", async () => {
    const user = await findUserByEmail(userEmail)

    if (user == null) {
      throw new Error(`expected user with email ${userEmail} to be defined`)
    }

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(user).toHaveProperty("password")
    expect(user.password).not.toHaveProperty("passwordHash")
  })

  it("should find user by email with password hash", async () => {
    const user = await findUserByEmail(userEmail, true)

    if (user == null) {
      throw new Error(`expected user with email ${userEmail} to be defined`)
    }

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(user).toHaveProperty("password")
    expect(user.password).toHaveProperty("passwordHash")
  })

  it("should delete user by email", async () => {
    const user = await deleteUserByEmail(userEmail)

    if (user == null) {
      throw new Error(`expected deleted user with email ${userEmail} to be defined`)
    }

    expect(user).toHaveProperty("deletedId")
  })
})

describe("users accounts", () => {
  const userEmail = "username@test.com"
  const userImageUrl = "https://placeholder.com"
  const userProvider = "github"
  const userProviderId = "gh_ABC"

  it("should create user with provider", async () => {
    const result = await createUserWithProvider(
      userEmail,
      userImageUrl,
      userProvider,
      userProviderId
    )

    if (result == null) {
      throw new Error(`expected result for user with email ${userEmail} to be defined`)
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
    const result = await findUserByProvider(userProvider, userProviderId)

    if (result == null) {
      throw new Error(`expected result for user with email ${userEmail} to be defined`)
    }

    expect(result).toHaveProperty("user")
    expect(result).toHaveProperty("account")

    const { user, account } = result

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(account).toHaveProperty("provider")
    expect(account.provider).toEqual(userProvider)
  })

  it("should delete user by email", async () => {
    const user = await deleteUserByEmail(userEmail)

    if (user == null) {
      throw new Error(`expected deleted user with email ${userEmail} to be defined`)
    }

    expect(user).toHaveProperty("deletedId")
  })
})
