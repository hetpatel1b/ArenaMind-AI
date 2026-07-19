import { UserRole } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { accessibilityService } from '@/lib/modules/accessibility/service';
import { successResponse } from '@/lib/api/response';
import { UpdateAccessibilityRequestDtoSchema } from '@/lib/modules/accessibility/dto';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const requestId = params?.requestId;
    if (!matchId || !requestId) throw new Error('Missing parameters');

    const request = await accessibilityService.getRequestById(bizContext, matchId, requestId);
    return successResponse(request);
  },
  {
    requireAuth: true,
    allowedRoles: [UserRole.operations_manager, UserRole.deputy_manager, UserRole.coordinator],
  }
);

export const PATCH = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const requestId = params?.requestId;
    if (!matchId || !requestId) throw new Error('Missing parameters');

    const body = await req.json();
    const payload = UpdateAccessibilityRequestDtoSchema.parse(body);

    const request = await accessibilityService.updateRequest(
      bizContext,
      matchId,
      requestId,
      payload
    );
    return successResponse(request);
  },
  {
    requireAuth: true,
    allowedRoles: [UserRole.operations_manager, UserRole.deputy_manager, UserRole.coordinator],
  }
);
