import { z } from "zod"
import { createEnv } from "@t3-oss/env-nextjs"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["test", "development", "production"]),
    AUTH_SECRET: z.string().min(12),
    DATABASE_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
  },
  onValidationError: issues => {
    console.error("❌ Invalid server environment variables ❌", issues)
    // eslint-disable-next-line n/no-process-exit
    process.exit(1)
  },
  runtimeEnv: {
    /* eslint-disable n/no-process-env */
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    /* eslint-enable n/no-process-env */
  },
  emptyStringAsUndefined: true,
  /* eslint-disable-next-line n/no-process-env */
  skipValidation: process.env.SKIP_ENV_VALIDATIONS === "true",
})
