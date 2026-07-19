import { z } from 'zod';

export const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid URL').optional(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required').optional(),

  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters long'),
  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL')
    .optional()
    .default('http://localhost:3000'),

  GROK_API_KEY: z.string().min(1, 'GROK_API_KEY is required').optional(),
  GROK_MODEL: z.string().min(1).default('grok-beta'),

  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().min(1).default('gemini-2.0-flash'),

  REDIS_URL: z.string().url('REDIS_URL must be a valid URL'),

  MAPTILER_API_KEY: z.string().min(1, 'MAPTILER_API_KEY is required').optional(),
  VERCEL_URL: z.string().optional(),

  STORAGE_PATH: z.string().min(1).default('./storage'),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

let parsedEnv: Environment;

try {
  // We use process.env directly, but handle edge cases for browser environments
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GROK_API_KEY: process.env.GROK_API_KEY,
    GROK_MODEL: process.env.GROK_MODEL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    REDIS_URL: process.env.REDIS_URL,
    MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
    STORAGE_PATH: process.env.STORAGE_PATH,
  };

  if (typeof window === 'undefined') {
    parsedEnv = EnvironmentSchema.parse(envVars);
  } else {
    // In the browser, server-side env vars are undefined. We skip strict validation
    // to prevent crashing the client-side app on import.
    parsedEnv = envVars as Environment;
  }
} catch (err) {
  if (err instanceof z.ZodError) {
    // eslint-disable-next-line no-console
    console.error('❌ CRITICAL STARTUP FAILURE: Invalid Environment Variables ❌');
    for (const issue of err.issues) {
      // eslint-disable-next-line no-console
      console.error(`  - [${issue.path.join('.')}] ${issue.message}`);
    }
    // eslint-disable-next-line no-console
    console.error('\nPlease fix the configuration above before restarting the application.');

    // Do not swallow in production/staging to ensure deployment safety
    const nodeEnv = process.env.NODE_ENV as string;
    if (nodeEnv === 'production' || nodeEnv === 'staging') {
      process.exit(1);
    } else {
      throw new Error('Environment validation failed');
    }
  }
  throw err;
}

export const env = parsedEnv;
