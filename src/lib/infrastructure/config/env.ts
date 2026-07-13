import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ENABLE_AI_FEATURES: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),
  REDIS_URL: z.string().url().optional(),
});

/**
 * Validated, strictly typed configuration object.
 */
export const config = EnvSchema.parse(process.env);
