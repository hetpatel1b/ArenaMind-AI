import { NextResponse } from 'next/server';
import { OrganizationService } from '@/server/services/organization.service';
import { createRouteHandler } from '@/lib/api/route-factory';
import { UserRole } from '@prisma/client';

export const GET = createRouteHandler(
  async (req) => {
    const organizations = await OrganizationService.getOrganizations();
    return NextResponse.json(organizations);
  },
  { requireAuth: true, allowedRoles: [UserRole.super_admin, UserRole.organization_admin] }
);

export const POST = createRouteHandler(
  async (req, { bizContext }) => {
    const body = await req.json();
    const org = await OrganizationService.createOrganization(body, bizContext.userId as string);
    return NextResponse.json(org, { status: 201 });
  },
  { requireAuth: true, allowedRoles: [UserRole.super_admin] }
);
