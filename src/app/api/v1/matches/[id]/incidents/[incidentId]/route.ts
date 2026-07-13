import { createRouteHandler } from '@/lib/api/route-factory';
import { incidentService } from '@/lib/modules/incidents/service';
import { successResponse } from '@/lib/api/response';
import { UpdateIncidentDtoSchema } from '@/lib/modules/incidents/dto';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const incidentId = params?.incidentId;
    if (!matchId || !incidentId) throw new Error('Missing parameters');

    const incident = await incidentService.getIncidentById(bizContext, matchId, incidentId);
    return successResponse(incident);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator', 'read_only'] as any,
  }
);

export const PATCH = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const incidentId = params?.incidentId;
    if (!matchId || !incidentId) throw new Error('Missing parameters');

    const body = await req.json();
    const payload = UpdateIncidentDtoSchema.parse(body);

    const incident = await incidentService.updateIncident(bizContext, matchId, incidentId, payload);
    return successResponse(incident);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'] as any,
  }
);
