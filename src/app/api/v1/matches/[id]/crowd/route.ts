import { Role } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { crowdService } from '@/lib/modules/crowd/service';
import { paginatedResponse } from '@/lib/api/response';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const query = parseQueryParams(req.nextUrl.searchParams);
    const { data, meta } = await crowdService.listMatchCrowdData(bizContext, matchId, query);
    return paginatedResponse(data, meta);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'],
  }
);
