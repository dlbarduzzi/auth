import { describe, expect, it } from "vitest"

import { createUser } from "./actions"

describe("create user", () => {
  const testUserEmail = "user@test.com"
  it("should create user into the database", async () => {
    const newUser = await createUser(testUserEmail)
    if (newUser == null) {
      throw new Error("expected new user to be defined")
    }
    expect(newUser).toHaveProperty("id")
    expect(newUser.email).toBe(testUserEmail.toLowerCase())
  })
})
