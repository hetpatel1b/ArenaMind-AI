import { createRouteHandler } from '@/lib/api/route-factory';
import { matchService } from '@/lib/modules/matches/service';
import { successResponse } from '@/lib/api/response';
import { UpdateMatchDtoSchema } from '@/lib/modules/matches/dto';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const id = params?.id;
    if (!id) throw new Error('Missing match ID');

    const match = await matchService.getMatchById(bizContext, id);
    return successResponse(match);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator', 'read_only'] as any,
  }
);

export const PATCH = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const body = await req.json();
    const payload = UpdateMatchDtoSchema.parse(body);

    const match = await matchService.updateMatch(bizContext, matchId, payload);
    return successResponse(match);
  },
  { requireAuth: true, allowedRoles: ['operations_manager', 'deputy_manager'] as any }
);
