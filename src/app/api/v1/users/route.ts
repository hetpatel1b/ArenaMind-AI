import { NextResponse } from 'next/server';
import { GlobalErrorHandler } from '@/lib/platform/errors/GlobalErrorHandler';
import { UserService } from '@/server/services/user.service';
import { withRole, AuthenticatedRequest } from '@/server/middleware/rbac';
import { UserRole } from '@prisma/client';

export const GET = withRole(
  [UserRole.super_admin, UserRole.organization_admin, UserRole.operations_manager],
  async (req: AuthenticatedRequest) => {
    const { organizationId } = req.user;
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
    }

    const users = await UserService.getUsersByOrganization(organizationId);
    return NextResponse.json(users);
  }
);

export const POST = withRole(
  [UserRole.super_admin, UserRole.organization_admin],
  async (req: AuthenticatedRequest) => {
    const { organizationId, id: inviterId } = req.user;
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
    }

    try {
      const body = await req.json();
      const user = await UserService.inviteUser(body, inviterId, organizationId);
      return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
      return GlobalErrorHandler.handle(error);
    }
  }
);
