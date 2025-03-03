"use client"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

type Email =
  | "john@email.com"
  | "john.updated@email.com"
  | "brian@email.com"
  | "smith@email.com"

type Provider = "github" | "google" | "credential"

type User = {
  email: Email
  password?: string
  provider: Provider
  providerId?: string
}

const users: User[] = [
  {
    email: "john@email.com",
    provider: "github",
    providerId: "abc",
  },
  {
    email: "john.updated@email.com",
    provider: "github",
    providerId: "abc",
  },
  {
    email: "john@email.com",
    provider: "google",
    providerId: "xyz",
  },
  {
    email: "brian@email.com",
    provider: "google",
    providerId: "xyz123",
  },
  {
    email: "john@email.com",
    provider: "credential",
    password: "password",
  },
  {
    email: "smith@email.com",
    provider: "credential",
    password: "password",
  },
]

export function SignUpForm() {
  function getButtonColor(email: Email) {
    if (email === "john@email.com") {
      return "bg-sky-500 text-white hover:bg-sky-400 hover:text-white"
    }
    if (email === "john.updated@email.com") {
      return "bg-orange-500 text-white hover:bg-orange-400 hover:text-white"
    }
    if (email === "brian@email.com") {
      return "bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
    }
    return "bg-black text-white hover:bg-gray-800 hover:text-white"
  }
  return (
    <div>
      <div className="max-w-md divide-y-2 border border-gray-200">
        {users.map((user, index) => (
          <div key={index} className="flex flex-wrap justify-between gap-3 px-4 py-3">
            <div className="flex flex-col text-sm">
              <div className="min-w-52">{user.email}</div>
              <div className="space-x-3">
                <span>{user.provider}</span>
                <span>{user.providerId}</span>
              </div>
            </div>
            <div>
              <Button type="button" className={cn(getButtonColor(user.email))}>
                Sign up
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
