import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const StadiumDtoSchema = registerSchema(
  'Venue',
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    shortName: z.string(),
    city: z.string(),
    country: z.string(),
    capacity: z.number(),
    timezone: z.string(),
    zoneCount: z.number(),
    surfaceAreaSqm: z.number().nullable(),
    isActive: z.boolean(),
  })
);

export type StadiumDto = z.infer<typeof StadiumDtoSchema>;
