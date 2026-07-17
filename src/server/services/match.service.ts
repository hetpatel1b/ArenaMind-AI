import { prisma } from '../database/prisma';
import { AuditService } from '../audit/audit.service';
import { createMatchSchema, updateMatchSchema } from '../validators/match.schema';
import { z } from 'zod';

export class MatchService {
  static async getMatchesByOrganization(organizationId: string) {
    return prisma.match.findMany({
      where: { organizationId },
      include: {
        venue: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  static async getMatch(id: string, organizationId: string) {
    return prisma.match.findFirst({
      where: { id, organizationId },
      include: {
        venue: true,
        incidents: true,
        resources: true,
      },
    });
  }

  static async createMatch(data: z.infer<typeof createMatchSchema>, userId: string) {
    const match = await prisma.match.create({
      data,
    });

    await AuditService.log({
      tableName: 'Match',
      recordId: match.id,
      action: 'CREATE',
      userId,
      organizationId: match.organizationId,
      newData: match,
    });

    return match;
  }

  static async updateMatch(id: string, organizationId: string, data: z.infer<typeof updateMatchSchema>, userId: string) {
    const oldMatch = await prisma.match.findFirst({ where: { id, organizationId } });
    if (!oldMatch) throw new Error('Match not found');

    const match = await prisma.match.update({
      where: { id },
      data,
    });

    await AuditService.log({
      tableName: 'Match',
      recordId: match.id,
      action: 'UPDATE',
      userId,
      organizationId: match.organizationId,
      oldData: oldMatch,
      newData: match,
    });

    return match;
  }
}
