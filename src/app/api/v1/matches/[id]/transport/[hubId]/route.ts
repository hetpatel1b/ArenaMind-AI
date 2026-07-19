import { UserRole } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { transportService } from '@/lib/modules/transport/service';
import { successResponse } from '@/lib/api/response';
import { UpdateTransportDtoSchema } from '@/lib/modules/transport/dto';

export const PATCH = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const hubId = params?.hubId;
    if (!matchId || !hubId) throw new Error('Missing parameters');

    const body = await req.json();
    const payload = UpdateTransportDtoSchema.parse(body);

    await transportService.updateTransportHub(bizContext, matchId, hubId, payload);
    return successResponse({ success: true });
  },
  {
    requireAuth: true,
    allowedRoles: [UserRole.operations_manager, UserRole.deputy_manager, UserRole.coordinator],
  }
);
