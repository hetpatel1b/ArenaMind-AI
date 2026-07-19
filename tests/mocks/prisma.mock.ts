import { vi } from 'vitest';

/**
 * Mock instance of PrismaClient.
 * This provides a basic mock that returns objects with typical Prisma methods.
 * For deep mocking, you might want to use `vitest-mock-extended` in the future.
 */
export const prismaMock = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $transaction: vi.fn((cb) => cb(prismaMock)),
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  incident: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  match: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  venue: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};
