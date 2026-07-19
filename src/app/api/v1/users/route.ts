import { NextResponse } from 'next/server';
import { UserService } from '@/server/services/user.service';
import { createRouteHandler } from '@/lib/api/route-factory';
import { UserRole } from '@prisma/client';

export const GET = createRouteHandler(
  async (req, { bizContext }) => {
    const { venueId: organizationId } = bizContext;
    if (!organizationId) {
      return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
    }

    const users = await UserService.getUsersByOrganization(organizationId);
    return NextResponse.json(users);
  },
  {
    requireAuth: true,
    allowedRoles: [UserRole.super_admin, UserRole.organization_admin, UserRole.operations_manager],
  }
);

export const POST = createRouteHandler(
  async (req, { bizContext }) => {
    const { venueId: organizationId, userId: inviterId } = bizContext;
    if (!organizationId || !inviterId) {
      return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
    }

    const body = await req.json();
    const user = await UserService.inviteUser(body, inviterId as string, organizationId);
    return NextResponse.json(user, { status: 201 });
  },
  { requireAuth: true, allowedRoles: [UserRole.super_admin, UserRole.organization_admin] }
);
