import { createRouteHandler } from '@/lib/api/route-factory';
import { searchService } from '@/lib/modules/search/service';
import { successResponse } from '@/lib/api/response';

export const GET = createRouteHandler(
  async (req, { bizContext }) => {
    const query = req.nextUrl.searchParams.get('q') || '';
    const results = await searchService.globalSearch(bizContext, query);
    return successResponse(results);
  },
  { requireAuth: true }
);
