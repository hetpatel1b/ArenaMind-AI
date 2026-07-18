import { Role } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { settingService } from '@/lib/modules/settings/service';
import { successResponse } from '@/lib/api/response';
import { UpdateSettingDtoSchema } from '@/lib/modules/settings/dto';

export const GET = createRouteHandler(
  async (req, { bizContext }) => {
    const settings = await settingService.getStadiumSettings(bizContext);
    return successResponse(settings);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'],
  }
);

export const PATCH = createRouteHandler(
  async (req, { bizContext }) => {
    const body = await req.json();
    const payload = UpdateSettingDtoSchema.parse(body);

    const setting = await settingService.updateSetting(bizContext, payload);
    return successResponse(setting);
  },
  { requireAuth: true, allowedRoles: ['operations_manager'] } // Only highest roles can update settings
);
