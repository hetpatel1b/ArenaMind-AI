import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnvironmentSchema } from '@/lib/config/env';

describe('Environment Configuration', () => {
  const validEnvVars = {
    NODE_ENV: 'development',
    DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-123',
    NEXTAUTH_SECRET: 'super-secret-key-that-is-at-least-32-chars-long',
    GEMINI_API_KEY: 'gemini-key',
    REDIS_URL: 'redis://localhost:6379',
  };

  it('validates a correct environment object', () => {
    const result = EnvironmentSchema.safeParse(validEnvVars);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe('development');
      expect(result.data.DATABASE_URL).toBe(validEnvVars.DATABASE_URL);
    }
  });

  it('applies default values for optional fields', () => {
    const result = EnvironmentSchema.safeParse(validEnvVars);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.LOG_LEVEL).toBe('info');
      expect(result.data.NEXTAUTH_URL).toBe('http://localhost:3000');
      expect(result.data.GROK_MODEL).toBe('grok-beta');
      expect(result.data.GEMINI_MODEL).toBe('gemini-2.0-flash');
      expect(result.data.STORAGE_PATH).toBe('./storage');
    }
  });

  it('fails if required variables are missing', () => {
    const invalidEnv = { ...validEnvVars };
    // @ts-expect-error
    delete invalidEnv.DATABASE_URL;

    const result = EnvironmentSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it('fails if NEXTAUTH_SECRET is too short', () => {
    const invalidEnv = { ...validEnvVars, NEXTAUTH_SECRET: 'short' };
    const result = EnvironmentSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it('fails if URL fields contain invalid URLs', () => {
    const invalidEnv = { ...validEnvVars, REDIS_URL: 'not-a-url' };
    const result = EnvironmentSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });
});
