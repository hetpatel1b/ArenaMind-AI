import { KpiSnapshot } from '@prisma/client';
import { KpiSnapshotDto } from './dto';

export function toKpiSnapshotDto(snapshot: KpiSnapshot): KpiSnapshotDto {
  return {
    id: snapshot.id,
    matchId: snapshot.matchId,
    venueId: snapshot.venueId as string,
    phase: snapshot.phase,
    openIncidents: snapshot.openIncidents,
    tier1Incidents: snapshot.tier1Incidents,
    resolvedIncidents: snapshot.resolvedIncidents,
    avgCrowdDensityPct: Number(snapshot.avgCrowdDensityPct),
    zonesAboveAlert: snapshot.zonesAboveAlert,
    resourcesDeployed: snapshot.resourcesDeployed,
    resourcesAvailable: snapshot.resourcesAvailable,
    healthScore: snapshot.healthScore,
    capturedAt: snapshot.capturedAt,
  };
}
