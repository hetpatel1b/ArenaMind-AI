import { createRouteHandler } from '@/lib/api/route-factory';
import { transportService } from '@/lib/modules/transport/service';
import { successResponse } from '@/lib/api/response';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const data = await transportService.listMatchTransport(bizContext, matchId);
    return successResponse(data);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator', 'read_only'] as any,
  }
);
