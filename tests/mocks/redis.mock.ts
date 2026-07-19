import { vi } from 'vitest';

/**
 * Shared mock for ioredis.
 * Simulates basic redis commands used for caching.
 */
export const redisMock = {
  get: vi.fn(),
  set: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
  flushall: vi.fn(),
  quit: vi.fn(),
  on: vi.fn(),
};
