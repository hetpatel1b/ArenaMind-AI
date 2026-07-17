import { NextRequest } from 'next/server';
import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { paginatedResponse } from '@/lib/api/response';
import { workforceService } from '@/lib/modules/workforce/service';

export const GET = createRouteHandler(async (req: NextRequest, { bizContext }) => {
  const url = new URL(req.url);
  const query = parseQueryParams(url.searchParams);

  const result = await workforceService.listUnits(bizContext, query);
  return paginatedResponse(result.data, result.meta);
});
