import type { Provider } from "@/db/schemas/accounts"

import { findUserByEmail, findAccountByProvider } from "./actions/users"

import { AuthError } from "@/lib/error"

export async function connectUserAccount(
  email: string,
  imageUrl: string,
  provider: Provider,
  providerId: string
) {
  const user = await findUserByEmail(email)

  if (user != null) {
    if (user.password != null) {
      return "USER_ALREADY_LINKED"
    }

    if (user.account != null) {
      if (
        user.account.provider === provider &&
        user.account.providerId === providerId
      ) {
        if (user.imageUrl !== imageUrl) {
          // TODO: Update user image url.
        }
        return "CREATE_USER_SESSION"
      } else {
        return "USER_ALREADY_LINKED"
      }
    }

    // Should never get here.
    throw new AuthError(`user with id ${user.id} found without account or password`, {
      cause: "user found without an account or password record",
      caller: "connectUserAccount",
    })
  }

  const account = await findAccountByProvider(provider, providerId)

  if (account == null) {
    return "SHOULD_CREATE_USER"
  }

  return "UPDATE_USER_EMAIL_AND_IMAGE_URL"
}
