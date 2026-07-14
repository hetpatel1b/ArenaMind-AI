import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { TransportDto, UpdateTransportDto } from './dto';
import { prisma } from '@/lib/db/client';
import { NotFoundError } from '@/lib/errors/http.errors';

export class TransportService extends BaseService {
  constructor() {
    super('TransportService');
  }

  async listMatchTransport(ctx: BusinessContext, matchId: string): Promise<TransportDto[]> {
    return this.execute('listMatchTransport', ctx, async () => {
      // Because Transport tables were deferred in Phase 2C, we extract live
      // transport telemetry structurally stored within the Match metadata JSON.
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        select: { id: true, stadiumId: true, metadata: true },
      });

      if (!match) throw new NotFoundError('Match not found');

      this.enforceTenantIsolation(ctx, match.stadiumId);

      const metadata = (match.metadata as any) || {};
      const transportData = metadata.transportation || [];

      // Map raw JSON to DTO
      return transportData.map((t: any, index: number) => ({
        id: `transport-${match.id}-${index}`,
        matchId: match.id,
        stadiumId: match.stadiumId,
        type: t.type || 'shuttle',
        name: t.name || 'General Transport',
        capacity: t.capacity || 0,
        utilizationPct: t.utilizationPct || 0,
        status: t.status || 'operational',
        estimatedWaitTime: t.estimatedWaitTime || null,
      })) as TransportDto[];
    });
  }

  async updateTransportHub(
    ctx: BusinessContext,
    matchId: string,
    hubId: string,
    payload: UpdateTransportDto
  ) {
    return this.execute('updateTransport', ctx, async () => {
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) throw new NotFoundError('Match not found');
      this.enforceTenantIsolation(ctx, match.stadiumId);

      await prisma.$transaction(async (tx) => {
        const m = await tx.match.findUnique({ where: { id: matchId } });
        const meta = (m!.metadata as any) || {};
        meta.transportation = meta.transportation || [];

        let found = false;
        const hubIndex = meta.transportation.findIndex(
          (t: any, idx: number) => t.id === hubId || `transport-${matchId}-${idx}` === hubId
        );
        if (hubIndex >= 0) {
          meta.transportation[hubIndex] = { ...meta.transportation[hubIndex], ...payload };
          found = true;
        } else {
          // Parking fallback
          meta.parking = meta.parking || [];
          const parkIndex = meta.parking.findIndex(
            (p: any, idx: number) => p.id === hubId || `parking-${matchId}-${idx}` === hubId
          );
          if (parkIndex >= 0) {
            meta.parking[parkIndex] = { ...meta.parking[parkIndex], ...payload };
            found = true;
          }
        }

        if (!found) {
          throw new NotFoundError('Transport/Parking hub not found');
        }

        await tx.match.update({ where: { id: matchId }, data: { metadata: meta } });
        await tx.auditLog.create({
          data: { recordId: matchId, tableName: 'unknown', action: 'UPDATE_TRANSPORT_PARKING' },
        });
      });
      return { success: true };
    });
  }
}

export const transportService = new TransportService();
