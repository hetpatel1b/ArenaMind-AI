import { vi } from 'vitest';
import { createTestSession } from '../helpers/auth.helpers';

/**
 * Shared mock for next-auth/react and next-auth
 */
export const nextAuthMock = {
  auth: vi.fn().mockResolvedValue(createTestSession()),
  signIn: vi.fn(),
  signOut: vi.fn(),
};

// React specific hooks
export const nextAuthReactMock = {
  useSession: vi.fn().mockReturnValue({
    data: createTestSession(),
    status: 'authenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn().mockResolvedValue(createTestSession()),
};
