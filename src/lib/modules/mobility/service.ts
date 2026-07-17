import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { mobilityRepository } from './repository';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { MobilitySnapshot } from '@prisma/client';

export class MobilityService extends BaseService {
  constructor() {
    super('MobilityService');
  }

  async listSnapshots(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<MobilitySnapshot>> {
    return this.execute('listSnapshots', ctx, async () => {
      const filter = {
        matchId,
        ...(ctx.venueId !== 'GLOBAL' ? { venueId: ctx.venueId } : {}),
      };

      return mobilityRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort || [{ field: 'capturedAt', order: 'desc' }],
      });
    });
  }
}

export const mobilityService = new MobilityService();
