import { describe, it, expect, vi } from 'vitest';
import { createRouteHandler } from '@/lib/api/route-factory';
import { createMockRequest } from '../helpers/request.helpers';
import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';

describe('RBAC & Context Integration', () => {
  const dummyHandler = async (req: any, { bizContext }: any) => {
    return NextResponse.json({ success: true, bizContext });
  };

  it('rejects unauthenticated requests if requireAuth is true', async () => {
    const handler = createRouteHandler(dummyHandler, { requireAuth: true });

    // Request with no headers
    const req = createMockRequest();

    const res = await handler(req, { params: {} });
    expect(res.status).toBe(401);
  });

  it('allows access and propagates context if role matches', async () => {
    const handler = createRouteHandler(dummyHandler, {
      requireAuth: true,
      allowedRoles: [UserRole.super_admin, UserRole.organization_admin],
    });

    const req = createMockRequest({
      userId: 'admin-123',
      role: UserRole.organization_admin,
      organizationId: 'org-456',
    });

    const res = await handler(req, { params: {} });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.bizContext).toEqual(
      expect.objectContaining({
        userId: 'admin-123',
        role: UserRole.organization_admin,
        venueId: 'org-456',
      })
    );
    expect(data.bizContext.correlationId).toBeDefined();
  });

  it('rejects access if role is explicitly disallowed', async () => {
    const handler = createRouteHandler(dummyHandler, {
      requireAuth: true,
      allowedRoles: [UserRole.super_admin],
    });

    const req = createMockRequest({
      userId: 'viewer-123',
      role: UserRole.coordinator,
      organizationId: 'org-456',
    });

    const res = await handler(req, { params: {} });
    expect(res.status).toBe(403);

    const data = await res.json();
    expect(data.error.message).toContain('Role not authorized');
  });

  it('rejects access if missing specific required permissions', async () => {
    const handler = createRouteHandler(dummyHandler, {
      requireAuth: true,
      requiredPermissions: ['manage:users' as any],
    });

    const req = createMockRequest({
      userId: 'viewer-123',
      role: UserRole.coordinator,
      organizationId: 'org-456',
    });

    const res = await handler(req, { params: {} });
    expect(res.status).toBe(403);

    const data = await res.json();
    expect(data.error.message).toContain('Missing required permission');
  });
});
