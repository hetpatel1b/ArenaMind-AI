import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { accessibilityService } from '@/lib/modules/accessibility/service';
import { paginatedResponse, successResponse } from '@/lib/api/response';
import { CreateAccessibilityRequestDtoSchema } from '@/lib/modules/accessibility/dto';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const query = parseQueryParams(req.nextUrl.searchParams);
    const { data, meta } = await accessibilityService.listMatchRequests(bizContext, matchId, query);
    return paginatedResponse(data, meta);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator', 'read_only'] as any,
  }
);

export const POST = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const body = await req.json();
    const payload = CreateAccessibilityRequestDtoSchema.parse(body);

    const request = await accessibilityService.createRequest(bizContext, matchId, payload);
    return successResponse(request, 201);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'] as any,
  }
);
