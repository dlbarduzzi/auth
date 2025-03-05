import { describe, expect, it } from "vitest"

import { lowercase } from "@/lib/utils"

import { connectUserAccount } from "./connect"
import { deleteUserByEmail } from "./actions/users"

describe("connect account", () => {
  const userEmail = "username@test.com"
  const userImageUrl = "https://placeholder.com"
  const userProvider = "github"
  const userProviderId = "gh_ABC"

  it("should connect user account", async () => {
    const resp = await connectUserAccount(
      userEmail,
      userImageUrl,
      userProvider,
      userProviderId
    )
    expect(resp).toHaveProperty("status")
    expect(resp.status).toBe("SUCCESS")

    // Make typescript happy.
    if (resp.status != "SUCCESS") {
      throw new Error(`expected resp status to be SUCCESS, got ${resp.status}`)
    }

    expect(resp).toHaveProperty("user")
    expect(resp.user).toHaveProperty("id")
    expect(resp.user).toHaveProperty("email")
    expect(resp.user.email).toEqual(lowercase(userEmail))
  })

  it("should delete user by email", async () => {
    const user = await deleteUserByEmail(userEmail)

    if (user == null) {
      throw new Error(`expected deleted user with email ${userEmail} to be defined`)
    }

    expect(user).toHaveProperty("deletedId")
  })
})
