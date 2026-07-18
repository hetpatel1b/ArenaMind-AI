import { Role } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { stadiumService } from '@/lib/modules/venues/service';
import { successResponse } from '@/lib/api/response';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const id = params?.id;
    if (!id) throw new Error('Missing venue ID');

    const venue = await stadiumService.getStadiumById(bizContext, id);
    return successResponse(venue);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'],
  }
);
