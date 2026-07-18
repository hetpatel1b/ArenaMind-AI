import { createRouteHandler } from '@/lib/api/route-factory';
import { alertService } from '@/lib/modules/alerts/service';
import { successResponse } from '@/lib/api/response';
import { UpdateAlertDtoSchema } from '@/lib/modules/alerts/dto';

export const PATCH = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    const alertId = params?.alertId;
    if (!matchId || !alertId) throw new Error('Missing parameters');

    const body = await req.json();
    const payload = UpdateAlertDtoSchema.parse(body);

    const alert = await alertService.acknowledgeAlert(bizContext, matchId, alertId, payload);
    return successResponse(alert);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'],
  }
);
