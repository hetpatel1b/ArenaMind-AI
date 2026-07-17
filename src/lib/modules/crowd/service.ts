import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { crowdSnapshotRepository } from './repository';
import { toCrowdDataDto } from './mapper';
import { CrowdDataDto } from './dto';
import { NotFoundError } from '@/lib/errors/http.errors';
import { QueryParamsDTO, extractAllowedFilters } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';

export class CrowdService extends BaseService {
  constructor() {
    super('CrowdService');
  }

  async listMatchCrowdData(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<CrowdDataDto>> {
    return this.execute('listMatchCrowdData', ctx, async () => {
      const userFilters = extractAllowedFilters(query.filters, ['zoneId']);

      const filter = {
        matchId,
        ...(ctx.venueId !== 'GLOBAL' ? { venueId: ctx.venueId } : {}),
        ...userFilters,
      };

      const { data, meta } = await crowdSnapshotRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort || [{ field: 'recordedAt', order: 'desc' }], // default latest first
      });

      return {
        data: data.map(toCrowdDataDto),
        meta,
      };
    });
  }
}

export const crowdService = new CrowdService();
