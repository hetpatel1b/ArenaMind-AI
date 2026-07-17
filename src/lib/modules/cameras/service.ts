import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { cameraRepository } from './repository';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { Camera } from '@prisma/client';

export class CameraService extends BaseService {
  constructor() {
    super('CameraService');
  }

  async listCameras(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<Camera>> {
    return this.execute('listCameras', ctx, async () => {
      const filter = {
        ...(ctx.venueId !== 'GLOBAL' ? { venueId: ctx.venueId } : {}),
      };

      return cameraRepository.findAll({
        filter,
        pagination: query.pagination,
      });
    });
  }
}

export const cameraService = new CameraService();
