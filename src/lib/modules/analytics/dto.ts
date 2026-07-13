import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const KpiSnapshotDtoSchema = registerSchema(
  'KpiSnapshot',
  z.object({
    id: z.string().uuid(),
    matchId: z.string().uuid(),
    stadiumId: z.string().uuid(),
    phase: z.string(),
    openIncidents: z.number(),
    tier1Incidents: z.number(),
    resolvedIncidents: z.number(),
    avgCrowdDensityPct: z.number(),
    zonesAboveAlert: z.number(),
    resourcesDeployed: z.number(),
    resourcesAvailable: z.number(),
    healthScore: z.number(),
    capturedAt: z.date(),
  })
);

export type KpiSnapshotDto = z.infer<typeof KpiSnapshotDtoSchema>;
