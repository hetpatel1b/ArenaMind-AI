import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { kpiSnapshotRepository } from './repository';
import { toKpiSnapshotDto } from './mapper';
import { KpiSnapshotDto } from './dto';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';

export class AnalyticsService extends BaseService {
  constructor() {
    super('AnalyticsService');
  }

  async listMatchAnalytics(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<KpiSnapshotDto>> {
    return this.execute('listMatchAnalytics', ctx, async () => {
      const filter =
        ctx.stadiumId !== 'GLOBAL' ? { matchId, stadiumId: ctx.stadiumId } : { matchId };

      const { data, meta } = await kpiSnapshotRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort || [{ field: 'capturedAt', order: 'desc' }], // default latest first
      });

      return {
        data: data.map(toKpiSnapshotDto),
        meta,
      };
    });
  }
}

export const analyticsService = new AnalyticsService();
