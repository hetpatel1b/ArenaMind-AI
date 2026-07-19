import { z } from 'zod';

export const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters long')
    .optional()
    .default('development-secret-do-not-use-in-production'),
  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL')
    .optional()
    .default('http://localhost:3000'),
  GROK_API_KEY: z.string().min(1, 'GROK_API_KEY is required').optional(),
  GROK_MODEL: z.string().min(1).default('grok-beta'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required').optional(),
  GEMINI_MODEL: z.string().min(1).default('gemini-1.5-pro'),
  REDIS_URL: z.string().url('REDIS_URL must be a valid URL').optional(),
  STORAGE_PATH: z.string().min(1).default('./storage'),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

export class EnvironmentValidator {
  /**
   * Validates the provided environment variables against the schema.
   * Throws detailed diagnostic errors if validation fails.
   */
  static validate(env: Record<string, string | undefined>): Environment {
    const result = EnvironmentSchema.safeParse(env);

    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error('❌ CRITICAL STARTUP FAILURE: Invalid Environment Variables ❌');

      for (const issue of result.error.issues) {
        // eslint-disable-next-line no-console
        console.error(`  - [${issue.path.join('.')}] ${issue.message}`);
      }

      // eslint-disable-next-line no-console
      console.error('\nPlease fix the configuration above before restarting the application.');

      // We only forcefully exit in production or staging to prevent invalid state
      if (env.NODE_ENV === 'production' || env.NODE_ENV === 'staging') {
        process.exit(1);
      }

      // In development/test, we might still throw to prevent the app from continuing
      throw new Error('Environment validation failed');
    }

    return result.data;
  }
}
