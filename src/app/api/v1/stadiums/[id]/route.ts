import { createRouteHandler } from '@/lib/api/route-factory';
import { stadiumService } from '@/lib/modules/stadiums/service';
import { successResponse } from '@/lib/api/response';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const id = params?.id;
    if (!id) throw new Error('Missing stadium ID');

    const stadium = await stadiumService.getStadiumById(bizContext, id);
    return successResponse(stadium);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator', 'read_only'] as any,
  }
);
