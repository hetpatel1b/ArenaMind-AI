import { User, UserRole } from '@prisma/client';

/**
 * Deterministic factory for creating a User object.
 */
export const createUser = (overrides?: Partial<User>): User => {
  return {
    id: 'usr_00000000000000000000000000',
    email: 'test.user@arenamind.ai',
    name: 'Test User',
    role: UserRole.super_admin,
    password: 'hashed_password_mock',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    deletedAt: null,
    organizationId: 'org_00000000000000000000000000',
    emailVerified: null,
    image: null,
    department: 'Testing',
    phoneNumber: null,
    employeeId: null,
    isActive: true,
    isSuspended: false,
    mfaReady: false,
    lastLoginAt: null,
    sessionCount: 0,
    deviceCount: 0,
    preferences: {},
    metadata: {},
    ...overrides,
  };
};
