import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Incident } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { IIncidentRepository } from '@/lib/domain/repositories/incident.repository.interface';

export class IncidentRepository
  extends PrismaRepository<Incident, any, any>
  implements IIncidentRepository
{
  constructor() {
    super(prisma.incident, 'incident');
  }

  async createIncidentWithAction(
    matchId: string,
    venueId: string,
    userId: string,
    payload: any
  ): Promise<Incident> {
    return prisma.$transaction(async (tx) => {
      const newIncident = await tx.incident.create({
        data: {
          matchId,
          venueId,
          reportedBy: userId,
          title: payload.title,
          description: payload.description,
          zoneId: payload.zoneId,
          incidentTypeId: payload.incidentTypeId,
          locationDetail: payload.locationDetail,
          severityTier: payload.severityTier,
          tags: payload.tags,
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
    payload: any
  ): Promise<Incident> {
    return prisma.$transaction(async (tx) => {
      const updateData: any = { ...payload };

      if (payload.status === 'resolved' || payload.status === 'closed') {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = userId;
      }

      const result = await tx.incident.update({
        where: { id: incidentId },
        data: updateData,
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
