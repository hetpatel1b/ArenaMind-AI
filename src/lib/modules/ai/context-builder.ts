import { incidentRepository } from '@/lib/modules/incidents/repository';
import { matchRepository } from '@/lib/modules/matches/repository';
import { crowdDataRepository } from '@/lib/modules/crowd/repository';
import { resourceRepository } from '@/lib/modules/resources/repository';
import { BusinessContext } from '@/lib/services/business.context';

export class AiContextBuilder {
  /**
   * Aggregates real-time operational context for AI prompts.
   * Strips out unnecessary PII or massive fields to optimize token usage.
   */
  async buildMatchContext(ctx: BusinessContext, matchId: string) {
    const filter = { matchId, stadiumId: ctx.stadiumId };

    // Fetch match details
    const { data: matches } = await matchRepository.findAll({ filter });
    const match = matches[0];
    if (!match) throw new Error('Match not found for context building');

    // Fetch active incidents (open, active, monitoring)
    const { data: incidents } = await incidentRepository.findAll({
      filter: {
        ...filter,
        status: { in: ['open', 'active', 'monitoring'] },
      },
      sort: [{ field: 'severityTier', order: 'asc' }], // 1 is highest priority usually, or desc? We'll let LLM decide based on severityTier.
    });

    // Fetch recent crowd density (latest snapshot per zone)
    const { data: crowdData } = await crowdDataRepository.findAll({
      filter,
      sort: [{ field: 'recordedAt', order: 'desc' }],
      pagination: { page: 1, limit: 20 },
    });

    // Fetch available/deployed resources
    const { data: resources } = await resourceRepository.findAll({
      filter,
    });

    return {
      match: {
        id: match.id,
        currentPhase: match.currentPhase,
        attendance: match.actualAttendance || match.expectedAttendance,
      },
      activeIncidents: incidents.map((i: any) => ({
        id: i.id,
        title: i.title,
        severityTier: i.severityTier,
        status: i.status,
        createdAt: i.createdAt,
      })),
      crowdDensity: crowdData.map((c: any) => ({
        zoneId: c.zoneId,
        densityPct: c.densityPct,
        fanCount: c.fanCount,
      })),
      resourceSummary: {
        total: resources.length,
        deployed: resources.filter(
          (r: any) => r.status === 'deployed' || r.status === 'incident_assigned'
        ).length,
        available: resources.filter((r: any) => r.status === 'available').length,
      },
    };
  }
}

export const aiContextBuilder = new AiContextBuilder();
