import { vi } from 'vitest';

/**
 * Shared mock for @supabase/supabase-js
 */
export const supabaseMock = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
  auth: {
    getUser: vi.fn(),
    getSession: vi.fn(),
  },
};

export const createClientMock = vi.fn(() => supabaseMock);
