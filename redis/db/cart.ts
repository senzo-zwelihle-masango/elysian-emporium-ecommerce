import { Redis } from '@upstash/redis'
import { env } from '@/env/server'

export const redisShoppingCart = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
})
