import { generateId } from "@/services/auth/utils"
import { createSession } from "@/services/auth/actions/sessions"

export async function GET() {
  const token = generateId(32)
  try {
    const session = await createSession(token, "cc8c2f6c-54f6-4f37-8518-f2c9f5b8e3f7")
    console.log({ session })
  } catch (error) {
    console.log(error)
    return new Response("GitHub callback ERROR!", { status: 200 })
  }
  return new Response("GitHub callback", { status: 200 })
}
