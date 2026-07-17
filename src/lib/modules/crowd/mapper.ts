import { CrowdSnapshot } from '@prisma/client';
import { CrowdDataDto } from './dto';

export function toCrowdDataDto(data: CrowdSnapshot): CrowdDataDto {
  return {
    id: data.id,
    matchId: data.matchId,
    venueId: data.venueId as string,
    zoneId: data.zoneId,
    fanCount: data.fanCount,
    safeCapacity: data.safeCapacity,
    densityPct: Number(data.densityPct),
    ingressRate: data.ingressRate,
    egressRate: data.egressRate,
    recordedAt: data.recordedAt,
  };
}
