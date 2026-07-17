import { NextRequest } from 'next/server';
import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { paginatedResponse } from '@/lib/api/response';
import { crowdService } from '@/lib/modules/crowd/service';

export const GET = createRouteHandler(async (req: NextRequest, { bizContext }) => {
  const url = new URL(req.url);
  const query = parseQueryParams(url.searchParams);
  const matchId = url.searchParams.get('matchId');

  if (!matchId) {
    throw new Error('matchId is required');
  }

  const result = await crowdService.listMatchCrowdData(bizContext, matchId, query);
  return paginatedResponse(result.data, result.meta);
});
