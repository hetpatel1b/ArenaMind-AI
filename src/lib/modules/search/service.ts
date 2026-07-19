import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { SearchResultDto } from './dto';
import { prisma } from '@/lib/db/client';

export class SearchService extends BaseService {
  constructor() {
    super('SearchService');
  }

  async globalSearch(ctx: BusinessContext, query: string): Promise<SearchResultDto[]> {
    return this.execute('globalSearch', ctx, async () => {
      if (!query || query.length < 2) return [];

      const results: SearchResultDto[] = [];
      const tenantFilter = ctx.venueId !== 'GLOBAL' ? { venueId: ctx.venueId } : {};

      // 1 & 2. Search Incidents and Matches Concurrently
      const [incidents, matches] = await Promise.all([
        prisma.incident.findMany({
          where: { ...tenantFilter, title: { contains: query, mode: 'insensitive' } },
          take: 5,
          select: { id: true, title: true, status: true },
        }),
        prisma.match.findMany({
          where: {
            ...tenantFilter,
            OR: [
              { homeTeam: { contains: query, mode: 'insensitive' } },
              { awayTeam: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 5,
          select: { id: true, homeTeam: true, awayTeam: true, matchStatus: true },
        }),
      ]);

      incidents.forEach((i) =>
        results.push({
          id: i.id,
          type: 'incident',
          title: i.title,
          subtitle: `Status: ${i.status}`,
        })
      );

      matches.forEach((m) =>
        results.push({
          id: m.id,
          type: 'match',
          title: `${m.homeTeam} vs ${m.awayTeam}`,
          subtitle: `Status: ${m.matchStatus}`,
        })
      );

      return results;
    });
  }
}

export const searchService = new SearchService();
