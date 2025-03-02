"use server"

import { eq } from "drizzle-orm"

import { db } from "@/db/conn"
import { users } from "@/db/schemas/users"

export async function findUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, email: true },
  })
}

export async function findUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
    columns: { id: true, email: true },
  })
}

export async function updateUserEmail(userId: string, email: string) {
  return await db.transaction(async tx => {
    const [user] = await tx
      .update(users)
      .set({ email })
      .where(eq(users.id, userId))
      .returning({ id: users.id, email: users.email })

    if (user == null) {
      tx.rollback()
      return
    }

    return user
  })
}
