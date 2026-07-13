import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const ResourceDtoSchema = registerSchema(
  'Resource',
  z.object({
    id: z.string().uuid(),
    stadiumId: z.string().uuid(),
    matchId: z.string().uuid().nullable(),
    zoneId: z.string().uuid().nullable(),
    resourceTypeId: z.string().uuid(),
    name: z.string(),
    status: z.string(),
  })
);

export type ResourceDto = z.infer<typeof ResourceDtoSchema>;

export const UpdateResourceDtoSchema = registerSchema(
  'UpdateResource',
  z.object({
    status: z
      .enum(['available', 'deployed', 'incident_assigned', 'off_duty', 'unavailable'])
      .optional(),
    zoneId: z.string().uuid().nullable().optional(),
  })
);
export type UpdateResourceDto = z.infer<typeof UpdateResourceDtoSchema>;
