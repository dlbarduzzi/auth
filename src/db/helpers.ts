import type { AnyPgColumn } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"

export function lower(value: AnyPgColumn) {
  return sql`lower(${value})`
}
