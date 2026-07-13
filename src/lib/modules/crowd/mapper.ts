import { CrowdData } from '@prisma/client';
import { CrowdDataDto } from './dto';

export function toCrowdDataDto(data: CrowdData): CrowdDataDto {
  return {
    id: data.id,
    matchId: data.matchId,
    stadiumId: data.stadiumId,
    zoneId: data.zoneId,
    fanCount: data.fanCount,
    safeCapacity: data.safeCapacity,
    densityPct: Number(data.densityPct),
    ingressRate: data.ingressRate,
    egressRate: data.egressRate,
    recordedAt: data.recordedAt,
  };
}
