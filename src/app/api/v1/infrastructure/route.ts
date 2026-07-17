import { NextRequest } from 'next/server';
import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { paginatedResponse } from '@/lib/api/response';
import { infrastructureService } from '@/lib/modules/infrastructure/service';

export const GET = createRouteHandler(async (req: NextRequest, { bizContext }) => {
  const url = new URL(req.url);
  const query = parseQueryParams(url.searchParams);

  const result = await infrastructureService.listNodes(bizContext, query);
  return paginatedResponse(result.data, result.meta);
});
