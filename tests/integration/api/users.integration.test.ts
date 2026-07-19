import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/v1/users/route';
import { createMockRequest } from '../../helpers/request.helpers';
import { prismaMock } from '../../mocks/prisma.mock';
import { UserRole } from '@prisma/client';
import { AuditService } from '@/server/audit/audit.service';
import bcrypt from 'bcrypt';

vi.mock('@/lib/db/client', async () => {
  const mod = await import('../../mocks/prisma.mock');
  return { prisma: mod.prismaMock };
});

vi.mock('@/server/audit/audit.service', () => ({
  AuditService: {
    log: vi.fn(),
  },
}));

describe('Users API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/users', () => {
    it('returns 401 if unauthenticated', async () => {
      const req = createMockRequest();
      const res = await GET(req, { params: {} });
      expect(res.status).toBe(401);
    });

    it('returns 403 if unauthorized role', async () => {
      const req = createMockRequest({
        userId: 'user-1',
        role: UserRole.coordinator,
        organizationId: 'org-1',
      });
      const res = await GET(req, { params: {} });
      expect(res.status).toBe(403);
    });

    it('returns 400 if organizationId is missing', async () => {
      const req = createMockRequest({
        userId: 'user-1',
        role: UserRole.organization_admin,
        organizationId: undefined, // missing
      });
      const res = await GET(req, { params: {} });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('No organization linked');
    });

    it('returns 400 if organizationId is missing', async () => {
      const req = createMockRequest({
        userId: 'user-1',
        role: UserRole.organization_admin,
        organizationId: undefined, // missing
      });
      const res = await GET(req, { params: {} });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('No organization linked');
    });

    it('returns 200 with users array for authorized roles', async () => {
      const mockUsers = [{ id: 'user-2', name: 'John Doe', email: 'john@example.com' }];
      prismaMock.user.findMany.mockResolvedValueOnce(mockUsers);

      const req = createMockRequest({
        userId: 'admin-1',
        role: UserRole.organization_admin,
        organizationId: 'org-1',
      });

      const res = await GET(req, { params: {} });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toEqual(mockUsers);

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
        select: expect.any(Object),
      });
    });
  });

  describe('POST /api/v1/users', () => {
    it('returns 400 if organizationId or inviterId is missing', async () => {
      const req = createMockRequest({
        method: 'POST',
        role: UserRole.organization_admin,
        organizationId: undefined, // missing
        userId: 'user-1', // Set this so we pass requireAuth middleware
        body: {},
      });
      const res = await POST(req, { params: {} });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('No organization linked');
    });

    it('returns 201 and creates user successfully', async () => {
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_pw' as never);
      const mockCreatedUser = { id: 'new-user', email: 'new@test.com', role: UserRole.coordinator };
      prismaMock.user.create.mockResolvedValueOnce(mockCreatedUser);

      const req = createMockRequest({
        method: 'POST',
        userId: 'admin-1',
        role: UserRole.organization_admin,
        organizationId: 'org-1',
        body: {
          email: 'new@test.com',
          name: 'New User',
          password: 'securepassword',
          role: UserRole.coordinator,
        },
      });

      const res = await POST(req, { params: {} });
      expect(res.status).toBe(201);

      const data = await res.json();
      expect(data).toEqual(mockCreatedUser);

      // Verify Prisma call
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'new@test.com',
          name: 'New User',
          organizationId: 'org-1',
          role: UserRole.coordinator,
          password: 'hashed_pw',
        }),
      });

      // Verify Audit Logging
      expect(AuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          tableName: 'User',
          recordId: 'new-user',
          action: 'CREATE',
          userId: 'admin-1',
          organizationId: 'org-1',
        })
      );
    });
  });
});
