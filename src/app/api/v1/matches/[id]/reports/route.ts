import { UserRole } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { parseQueryParams } from '@/lib/api/dto';
import { reportService } from '@/lib/modules/reports/service';
import { paginatedResponse, successResponse } from '@/lib/api/response';
import { CreateReportDtoSchema } from '@/lib/modules/reports/dto';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const query = parseQueryParams(req.nextUrl.searchParams);
    const { data, meta } = await reportService.listMatchReports(bizContext, matchId, query);
    return paginatedResponse(data, meta);
  },
  {
    requireAuth: true,
    allowedRoles: [UserRole.operations_manager, UserRole.deputy_manager, UserRole.coordinator],
  }
);

export const POST = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const body = await req.json();
    const payload = CreateReportDtoSchema.parse(body);

    const report = await reportService.createReport(bizContext, matchId, payload);
    return successResponse(report, 201);
  },
  { requireAuth: true, allowedRoles: [UserRole.operations_manager, UserRole.deputy_manager] }
);
