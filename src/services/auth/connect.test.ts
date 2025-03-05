import { describe, expect, it } from "vitest"

import { connectUserAccount } from "./connect"

import {
  createUserWithPassword,
  createUserWithProvider,
  deleteUserByEmail,
} from "./actions/users"

describe("connect account", () => {
  const userEmail1 = "connect.username1@test.com"
  const userEmail2 = "connect.username2@email.com"
  const userEmail3 = "connect.username3@email.com"
  const userEmail1Updated = "connect.username1updated@email.com"

  const imageUrl = "https://placeholder.com"
  const password = "password"

  const githubProvider = "github"
  const googleProvider = "google"

  const githubProviderId1 = "connect_gh_1"
  const githubProviderId2 = "connect_gh_2"
  const googleProviderId1 = "connect_go_1"

  it("should create user with password", async () => {
    const user = await createUserWithPassword(userEmail2, password)
    if (user == null) {
      throw new Error(`expected created user with email ${userEmail2} to be defined`)
    }
    expect(user).toHaveProperty("id")
  })

  it("should get account already linked 1", async () => {
    const resp = await connectUserAccount(
      userEmail2,
      imageUrl,
      githubProvider,
      githubProviderId1
    )
    expect(resp).toBe("USER_ALREADY_LINKED")
  })

  it("should get create new user", async () => {
    const resp = await connectUserAccount(
      userEmail1,
      imageUrl,
      githubProvider,
      githubProviderId1
    )
    expect(resp).toBe("SHOULD_CREATE_USER")
  })

  it("should create user with provider", async () => {
    const result = await createUserWithProvider(
      userEmail1,
      imageUrl,
      githubProvider,
      githubProviderId1
    )
    if (result == null) {
      throw new Error(`expected result for user with email ${userEmail1} to be defined`)
    }

    expect(result).toHaveProperty("user")
    expect(result).toHaveProperty("account")

    const { user, account } = result

    expect(user).toHaveProperty("id")
    expect(account).toHaveProperty("userId")
  })

  it("should get create user session", async () => {
    const resp = await connectUserAccount(
      userEmail1,
      imageUrl,
      githubProvider,
      githubProviderId1
    )
    expect(resp).toBe("CREATE_USER_SESSION")
  })

  it("should get account already linked 2", async () => {
    const resp = await connectUserAccount(
      userEmail1,
      imageUrl,
      githubProvider,
      githubProviderId2
    )
    expect(resp).toBe("USER_ALREADY_LINKED")
  })

  it("should get update user", async () => {
    const resp = await connectUserAccount(
      userEmail1Updated,
      imageUrl,
      githubProvider,
      githubProviderId1
    )
    expect(resp).toBe("UPDATE_USER_EMAIL_AND_IMAGE_URL")
  })

  it("should get account already linked 3", async () => {
    const resp = await connectUserAccount(
      userEmail1,
      imageUrl,
      googleProvider,
      googleProviderId1
    )
    expect(resp).toBe("USER_ALREADY_LINKED")
  })

  it("should get create new user 2", async () => {
    const resp = await connectUserAccount(
      userEmail3,
      imageUrl,
      googleProvider,
      googleProviderId1
    )
    expect(resp).toBe("SHOULD_CREATE_USER")
  })

  it("should delete user by email", async () => {
    await deleteUserByEmail(userEmail2)
    await deleteUserByEmail(userEmail1)
  })
})
