import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock pg to prevent real DB connection
vi.mock('pg', () => {
  return {
    Pool: class Pool {
      constructor() {}
    },
  };
});

// Mock adapter
vi.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: class PrismaPg {
      constructor() {}
    },
  };
});

vi.mock('@prisma/client', () => {
  let eventListeners: Record<string, Function> = {};
  return {
    PrismaClient: class PrismaClient {
      $on(event: string, callback: (...args: any[]) => any) {
        eventListeners[event] = callback;
      }
      _triggerEvent(event: string, data: any) {
        if (eventListeners[event]) {
          eventListeners[event](data);
        }
      }
    },
  };
});

vi.mock('../../../tests/e2e/mocks/prisma.mock', () => ({
  prismaMock: { isMock: true },
}));

describe('DB Client Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('initializes a PrismaClient when not in E2E mode', async () => {
    delete process.env.NEXT_PUBLIC_E2E_MODE;
    process.env.DATABASE_URL = 'postgres://fake-url';

    const { prisma } = await import('@/lib/db/client');
    expect(prisma).toBeDefined();
  });

  it('loads mock when in E2E mode', async () => {
    process.env.NEXT_PUBLIC_E2E_MODE = 'true';

    const { prisma } = await import('@/lib/db/client');
    expect(prisma).toEqual({ isMock: true });
  });

  it('logs slow queries', async () => {
    delete process.env.NEXT_PUBLIC_E2E_MODE;
    const { prisma } = await import('@/lib/db/client');

    const mockClient = prisma as any;

    // Trigger slow query event (>= 100ms)
    mockClient._triggerEvent('query', {
      duration: 150,
      query: 'SELECT * FROM users',
    });

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[SLOW QUERY] Duration: 150ms | Query: SELECT * FROM users')
    );
  });

  it('ignores fast queries', async () => {
    delete process.env.NEXT_PUBLIC_E2E_MODE;
    const { prisma } = await import('@/lib/db/client');

    const mockClient = prisma as any;

    // Trigger fast query event (< 100ms)
    mockClient._triggerEvent('query', {
      duration: 50,
      query: 'SELECT * FROM users',
    });

    expect(console.warn).not.toHaveBeenCalled();
  });
});
