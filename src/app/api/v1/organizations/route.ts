import { NextResponse } from 'next/server';
import { GlobalErrorHandler } from '@/lib/platform/errors/GlobalErrorHandler';
import { OrganizationService } from '@/server/services/organization.service';
import { withRole, AuthenticatedRequest } from '@/server/middleware/rbac';
import { UserRole } from '@prisma/client';

export const GET = withRole(
  [UserRole.super_admin, UserRole.organization_admin],
  async (req: AuthenticatedRequest) => {
    const organizations = await OrganizationService.getOrganizations();
    return NextResponse.json(organizations);
  }
);

export const POST = withRole([UserRole.super_admin], async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    const org = await OrganizationService.createOrganization(body, req.user.id);
    return NextResponse.json(org, { status: 201 });
  } catch (error: any) {
    return GlobalErrorHandler.handle(error);
  }
});
