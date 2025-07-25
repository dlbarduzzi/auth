import type { StatusCode } from "@/tools/http/status"

import { toStatusText } from "@/tools/http/status"

export function createResponse(
  obj: object,
  status: StatusCode,
  headers?: ResponseInit["headers"],
): Response {
  return new Response(JSON.stringify(obj), {
    status,
    statusText: toStatusText(status),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  })
}
