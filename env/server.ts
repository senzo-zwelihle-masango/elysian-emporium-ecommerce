import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),

    KV_URL: z.url(),
    KV_REST_API_URL: z.url(),
    KV_REST_API_TOKEN: z.string().min(1),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
    REDIS_URL: z.url(),

    UPSTASH_SEARCH_REST_URL: z.url(),
    UPSTASH_SEARCH_REST_READONLY_TOKEN: z.string().min(1),
    UPSTASH_SEARCH_REST_TOKEN: z.string().min(1),

    UPLOADTHING_TOKEN: z.string().min(1),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    RESEND_API_KEY: z.string().min(1),
    RESEND_EMAIL_LOGO: z.url(),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you can just reference process.env:
  experimental__runtimeEnv: process.env,
})
