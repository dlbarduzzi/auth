import type { Provider } from "@/db/schemas/accounts"

import {
  findUserByEmail,
  findUserByProvider,
  createUserWithProvider,
} from "./actions/users"

type ConnectUserAccount =
  | {
      status: "INTERNAL_SERVER_ERROR"
    }
  | {
      status: "SUCCESS"
      user: { id: string; email: string }
    }

export async function connectUserAccount(
  email: string,
  imageUrl: string,
  provider: Provider,
  providerId: string
): Promise<ConnectUserAccount> {
  const user = await findUserByEmail(email)
  const account = await findUserByProvider(provider, providerId)

  if (user == null && account == null) {
    const result = await createUserWithProvider(email, imageUrl, provider, providerId)
    if (result == null) {
      return { status: "INTERNAL_SERVER_ERROR" }
    }
    return { status: "SUCCESS", user: result.user }
  }

  return { status: "INTERNAL_SERVER_ERROR" }
}
