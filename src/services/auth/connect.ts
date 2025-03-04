import { findUserByEmailWithAccountAndPassword } from "./actions/users"

export async function connectUserAccount(email: string) {
  const user = await findUserByEmailWithAccountAndPassword(email)
  console.log(user)
}
