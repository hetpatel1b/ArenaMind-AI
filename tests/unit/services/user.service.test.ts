import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '@/server/services/user.service';
import { prisma } from '@/lib/db/client';
import { AuditService } from '@/server/audit/audit.service';
import bcrypt from 'bcrypt';

vi.mock('@/lib/db/client', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/server/audit/audit.service', () => ({
  AuditService: {
    log: vi.fn(),
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
  },
}));

describe('UserService', () => {
  const mockOrgId = 'org-123';
  const mockAdminId = 'admin-123';
  const mockUser = {
    id: 'user-1',
    organizationId: mockOrgId,
    name: 'Test User',
    email: 'test@example.com',
    role: 'STAFF',
    isActive: true,
    isSuspended: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets users by organization', async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([mockUser as any]);
    const users = await UserService.getUsersByOrganization(mockOrgId);
    expect(users).toEqual([mockUser]);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { organizationId: mockOrgId },
      select: expect.any(Object),
    });
  });

  it('invites a user and logs audit', async () => {
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any);
    
    const data = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      role: 'STAFF',
    };

    const user = await UserService.inviteUser(data, mockAdminId, mockOrgId);
    expect(user).toEqual(mockUser);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: data.email,
        name: data.name,
        password: 'hashed-password',
        role: data.role,
        organizationId: mockOrgId,
        isActive: true,
      },
    });
    expect(AuditService.log).toHaveBeenCalledWith(expect.objectContaining({
      action: 'CREATE',
      recordId: mockUser.id,
      userId: mockAdminId,
    }));
  });

  it('suspends a user and logs audit', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as any);
    const suspendedUser = { ...mockUser, isSuspended: true };
    vi.mocked(prisma.user.update).mockResolvedValue(suspendedUser as any);
    
    const user = await UserService.suspendUser('user-1', mockAdminId, mockOrgId);
    
    expect(user).toEqual(suspendedUser);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { isSuspended: true },
    });
    expect(AuditService.log).toHaveBeenCalledWith(expect.objectContaining({
      action: 'UPDATE',
      recordId: mockUser.id,
      userId: mockAdminId,
      oldData: { isSuspended: false },
      newData: { isSuspended: true },
    }));
  });

  it('throws error when suspending non-existent user', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    
    await expect(UserService.suspendUser('user-1', mockAdminId, mockOrgId))
      .rejects.toThrow('User not found');
  });
});
