import { z } from 'zod';
import { logger } from '../lib/observability/logger';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().min(1).optional(),
  GROK_API_KEY: z.string().min(1).optional(),
  GROK_MODEL: z.string().min(1).optional(),
});

/**
 * Validates the environment variables strictly at runtime.
 * Prevents the application from starting if misconfigured.
 */
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.error('❌ Invalid environment variables', {
      errors: parsed.error.flatten().fieldErrors,
    });
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = validateEnv();
