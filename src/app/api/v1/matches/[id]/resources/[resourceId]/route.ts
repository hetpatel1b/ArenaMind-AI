import { Role } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { resourceService } from '@/lib/modules/resources/service';
import { successResponse } from '@/lib/api/response';
import { UpdateResourceDtoSchema } from '@/lib/modules/resources/dto';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const resourceId = params?.resourceId;
    if (!matchId || !resourceId) throw new Error('Missing parameters');

    const resource = await resourceService.getResourceById(bizContext, matchId, resourceId);
    return successResponse(resource);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'],
  }
);

export const PATCH = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const resourceId = params?.resourceId;
    if (!matchId || !resourceId) throw new Error('Missing parameters');

    const body = await req.json();
    const payload = UpdateResourceDtoSchema.parse(body);

    const resource = await resourceService.updateResource(bizContext, matchId, resourceId, payload);
    return successResponse(resource);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'],
  }
);
