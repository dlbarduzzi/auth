import z from "zod"

import { isStrDate } from "./time"

export const strToDateSchema = z
  .string()
  .or(z.date())
  .refine(value => isStrDate(value))
  .transform(value => new Date(value))
