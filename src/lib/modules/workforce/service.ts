import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { workforceRepository } from './repository';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { WorkforceUnit } from '@prisma/client';

export class WorkforceService extends BaseService {
  constructor() {
    super('WorkforceService');
  }

  async listUnits(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<WorkforceUnit>> {
    return this.execute('listUnits', ctx, async () => {
      const filter = {
        ...(ctx.venueId !== 'GLOBAL' ? { venueId: ctx.venueId } : {}),
      };

      return workforceRepository.findAll({
        filter,
        pagination: query.pagination,
      });
    });
  }
}

export const workforceService = new WorkforceService();
