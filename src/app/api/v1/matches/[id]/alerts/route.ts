import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { alertService } from '@/lib/modules/alerts/service';
import { paginatedResponse, successResponse } from '@/lib/api/response';
import { CreateAlertDtoSchema } from '@/lib/modules/alerts/dto';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const query = parseQueryParams(req.nextUrl.searchParams);
    const { data, meta } = await alertService.listMatchAlerts(bizContext, matchId, query);
    return paginatedResponse(data, meta);
  },
  { requireAuth: true }
);

export const POST = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const body = await req.json();
    const payload = CreateAlertDtoSchema.parse(body);

    const alert = await alertService.createAlert(bizContext, matchId, payload);
    return successResponse(alert, 201);
  },
  { requireAuth: true, allowedRoles: ['operations_manager', 'deputy_manager'] as any }
);
