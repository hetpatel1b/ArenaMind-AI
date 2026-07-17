import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { stadiumRepository } from './repository';
import { toStadiumDto } from './mapper';
import { StadiumDto } from './dto';
import { NotFoundError } from '@/lib/errors/http.errors';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';

export class StadiumService extends BaseService {
  constructor() {
    super('StadiumService');
  }

  async getStadiumById(ctx: BusinessContext, id: string): Promise<StadiumDto> {
    return this.execute('getStadiumById', ctx, async () => {
      this.enforceTenantIsolation(ctx, id);

      const venue = await stadiumRepository.findById(id);
      if (!venue) {
        throw new NotFoundError(`Venue with ID ${id} not found`);
      }

      return toStadiumDto(venue);
    });
  }

  async listStadiums(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<StadiumDto>> {
    return this.execute('listStadiums', ctx, async () => {
      // Operations managers can only see their own venue unless global admin
      const filter = ctx.venueId !== 'GLOBAL' ? { id: ctx.venueId } : {};

      const { data, meta } = await stadiumRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort,
      });

      return {
        data: data.map(toStadiumDto),
        meta,
      };
    });
  }
}

export const stadiumService = new StadiumService();
