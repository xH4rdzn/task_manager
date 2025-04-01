import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['test', 'production', 'development']).default('production'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
