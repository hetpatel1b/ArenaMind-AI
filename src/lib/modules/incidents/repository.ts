import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Incident, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { IIncidentRepository } from '@/lib/domain/repositories/incident.repository.interface';

export class IncidentRepository
  extends PrismaRepository<Incident, SafeAny, SafeAny>
  implements IIncidentRepository
{
  constructor() {
    super(prisma.incident, 'incident');
  }

  async createIncidentWithAction(
    matchId: string,
    venueId: string,
    userId: string,
    payload: Record<string, SafeAny>
  ): Promise<Incident> {
    return prisma.$transaction(async (tx) => {
      const newIncident = await tx.incident.create({
        data: {
          matchId,
          venueId,
          reportedBy: userId,
          title: payload.title as string,
          description: payload.description as string,
          zoneId: payload.zoneId as string | null,
          incidentTypeId: payload.incidentTypeId as string | null,
          locationDetail: payload.locationDetail as string | null,
          severityTier: payload.severityTier as number,
          tags: payload.tags as string[],
          status: 'open',
        },
      });

      await tx.incidentAction.create({
        data: {
          incidentId: newIncident.id,
          userId,
        },
      });

      return newIncident;
    });
  }

  async updateIncidentWithAction(
    incidentId: string,
    userId: string,
    payload: Record<string, SafeAny>
  ): Promise<Incident> {
    return prisma.$transaction(async (tx) => {
      const updateData: Record<string, SafeAny> = { ...payload };

      if (payload.status === 'resolved' || payload.status === 'closed') {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = userId;
      }

      const result = await tx.incident.update({
        where: { id: incidentId },
        data: updateData as Prisma.IncidentUpdateInput,
      });

      await tx.incidentAction.create({
        data: {
          incidentId: result.id,
          userId,
        },
      });

      return result;
    });
  }
}

export const incidentRepository = new IncidentRepository();
