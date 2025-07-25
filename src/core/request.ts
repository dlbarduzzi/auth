import type { status } from "@/tools/http/status"
import type { HonoRequest } from "hono"

export async function getJsonInput(req: HonoRequest): Promise<
  | { code: typeof status.code.ok, data: unknown }
  | { code: typeof status.code.badRequest }
  | { code: typeof status.code.internalServerError, error: unknown }
> {
  try {
    const data = await req.json()
    return { code: 200, data }
  }
  catch (error) {
    if (error instanceof SyntaxError) {
      return { code: 400 }
    }
    else {
      return { code: 500, error }
    }
  }
}
