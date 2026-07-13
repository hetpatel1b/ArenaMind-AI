import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const CrowdDataDtoSchema = registerSchema(
  'CrowdData',
  z.object({
    id: z.string().uuid(),
    matchId: z.string().uuid(),
    stadiumId: z.string().uuid(),
    zoneId: z.string().uuid(),
    fanCount: z.number(),
    safeCapacity: z.number(),
    densityPct: z.number(),
    ingressRate: z.number().nullable(),
    egressRate: z.number().nullable(),
    recordedAt: z.date(),
  })
);

export type CrowdDataDto = z.infer<typeof CrowdDataDtoSchema>;
