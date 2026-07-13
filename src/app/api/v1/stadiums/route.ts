import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { stadiumService } from '@/lib/modules/stadiums/service';
import { paginatedResponse } from '@/lib/api/response';

export const GET = createRouteHandler(
  async (req, { bizContext }) => {
    const query = parseQueryParams(req.nextUrl.searchParams);
    const { data, meta } = await stadiumService.listStadiums(bizContext, query);
    return paginatedResponse(data, meta);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator', 'read_only'] as any,
  }
);
