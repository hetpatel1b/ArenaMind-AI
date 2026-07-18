import { Role } from '@prisma/client';
import { createRouteHandler } from '@/lib/api/route-factory';
import { userService } from '@/lib/modules/users/service';
import { successResponse } from '@/lib/api/response';
import { UpdateUserDtoSchema } from '@/lib/modules/users/dto';

export const GET = createRouteHandler(
  async (req, { bizContext }) => {
    const profile = await userService.getMyProfile(bizContext);
    return successResponse(profile);
  },
  {
    requireAuth: true,
    allowedRoles: ['operations_manager', 'deputy_manager', 'coordinator'],
  }
);

export const PATCH = createRouteHandler(
  async (req, { bizContext }) => {
    const body = await req.json();
    const payload = UpdateUserDtoSchema.parse(body);

    const user = await userService.updateMe(bizContext, payload);
    return successResponse(user);
  },
  { requireAuth: true } // Any authenticated user can update their own profile
);
