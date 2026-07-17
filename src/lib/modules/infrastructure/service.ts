import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { infrastructureRepository } from './repository';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { InfrastructureNode } from '@prisma/client';

export class InfrastructureService extends BaseService {
  constructor() {
    super('InfrastructureService');
  }

  async listNodes(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<InfrastructureNode>> {
    return this.execute('listNodes', ctx, async () => {
      const filter = {
        ...(ctx.venueId !== 'GLOBAL' ? { venueId: ctx.venueId } : {}),
      };

      return infrastructureRepository.findAll({
        filter,
        pagination: query.pagination,
      });
    });
  }
}

export const infrastructureService = new InfrastructureService();
