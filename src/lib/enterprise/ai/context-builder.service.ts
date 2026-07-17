import { BusinessContext } from '@/lib/services/business.context';
import { prisma } from '@/lib/db/client';

export class ContextBuilderService {
  async buildMatchContext(ctx: BusinessContext, matchId: string) {
    const isSystemDefault = matchId === 'system-default-match';
    const match = isSystemDefault
      ? await prisma.match.findFirst({
          include: {
            venue: true,
            incidents: {
              where: { status: { in: ['open', 'active'] } },
              take: 5,
              orderBy: { severityTier: 'asc' },
            },
            crowdSnapshots: {
              orderBy: { recordedAt: 'desc' },
              take: 5,
            },
            kpiSnapshots: {
              orderBy: { capturedAt: 'desc' },
              take: 1,
            },
            mobilitySnapshots: {
              orderBy: { capturedAt: 'desc' },
              take: 5,
            },
            resources: {
              where: { status: 'available' },
            },
          },
        })
      : await prisma.match.findUnique({
          where: { id: matchId },
          include: {
            venue: true,
            incidents: {
              where: { status: { in: ['open', 'active'] } },
              take: 5,
              orderBy: { severityTier: 'asc' },
            },
            crowdSnapshots: {
              orderBy: { recordedAt: 'desc' },
              take: 5,
            },
            kpiSnapshots: {
              orderBy: { capturedAt: 'desc' },
              take: 1,
            },
            mobilitySnapshots: {
              orderBy: { capturedAt: 'desc' },
              take: 5,
            },
            resources: {
              where: { status: 'available' },
            },
          },
        });

    if (!match) {
      if (isSystemDefault) {
        return {
          matchInfo: {
            phase: 'pre_match',
            status: 'scheduled',
            attendance: 50000,
          },
          venue: {
            name: 'ArenaMind Default Stadium',
            capacity: 80000,
          },
          kpis: {
            healthScore: 100,
            avgCrowdDensityPct: 0,
          },
          activeIncidents: [],
          crowdState: [],
          mobilityState: [],
          resources: {
            available: 100,
          },
        };
      }
      throw new Error('Match not found');
    }

    return {
      matchInfo: {
        phase: match.currentPhase,
        status: match.matchStatus,
        attendance: match.actualAttendance || match.expectedAttendance,
      },
      venue: {
        name: match.venue.name,
        capacity: match.venue.capacity,
      },
      kpis: match.kpiSnapshots[0] || {},
      activeIncidents: match.incidents.map((inc: any) => ({
        title: inc.title,
        severity: inc.severityTier,
        status: inc.status,
      })),
      crowdState: match.crowdSnapshots.map((cs: any) => ({
        zoneId: cs.zoneId,
        density: cs.densityPct,
      })),
      mobilityState: match.mobilitySnapshots.map((ms: any) => ({
        mode: ms.transitMode,
        status: ms.status,
        delay: ms.delayMinutes,
      })),
      resources: {
        available: match.resources.length,
      },
    };
  }
}

export const aiContextBuilder = new ContextBuilderService();
