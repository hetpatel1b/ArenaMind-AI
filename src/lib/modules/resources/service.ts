import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { resourceRepository } from './repository';
import { toResourceDto } from './mapper';
import { ResourceDto, UpdateResourceDto } from './dto';
import { NotFoundError } from '@/lib/errors/http.errors';
import { QueryParamsDTO, extractAllowedFilters } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { prisma } from '@/lib/db/client';

export class ResourceService extends BaseService {
  constructor() {
    super('ResourceService');
  }

  async getResourceById(
    ctx: BusinessContext,
    matchId: string,
    resourceId: string
  ): Promise<ResourceDto> {
    return this.execute('getResourceById', ctx, async () => {
      const resource = await resourceRepository.findById(resourceId);
      if (!resource || resource.matchId !== matchId) {
        throw new NotFoundError(`Resource with ID ${resourceId} not found`);
      }

      this.enforceTenantIsolation(ctx, resource.stadiumId);

      return toResourceDto(resource);
    });
  }

  async listMatchResources(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<ResourceDto>> {
    return this.execute('listMatchResources', ctx, async () => {
      const userFilters = extractAllowedFilters(query.filters, [
        'status',
        'zoneId',
        'resourceTypeId',
      ]);

      if (query.search?.query) {
        userFilters.name = { contains: query.search.query, mode: 'insensitive' };
      }

      const filter = {
        matchId,
        ...(ctx.stadiumId !== 'GLOBAL' ? { stadiumId: ctx.stadiumId } : {}),
        ...userFilters,
      };

      const { data, meta } = await resourceRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort,
      });

      return {
        data: data.map(toResourceDto),
        meta,
      };
    });
  }

  async updateResource(
    ctx: BusinessContext,
    matchId: string,
    resourceId: string,
    payload: UpdateResourceDto
  ): Promise<ResourceDto> {
    return this.execute('updateResource', ctx, async () => {
      if (!ctx.userId) throw new Error('User ID required to update resource');

      const existing = await resourceRepository.findById(resourceId);
      if (!existing || existing.matchId !== matchId) {
        throw new NotFoundError('Resource not found');
      }

      this.enforceTenantIsolation(ctx, existing.stadiumId);

      // Verify the new zone exists and belongs to the same stadium (if zoneId is provided)
      if (payload.zoneId) {
        const zone = await prisma.zone.findUnique({ where: { id: payload.zoneId } });
        if (!zone || zone.stadiumId !== existing.stadiumId) {
          throw new NotFoundError('Zone not found in this stadium');
        }
      }

      const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.resource.update({
          where: { id: resourceId },
          data: {
            ...payload,
          },
          include: {
            resourceType: true,
            zone: true,
          },
        });

        await tx.auditLog.create({
          data: {
            recordId: result.id,
            action: 'UPDATE_RESOURCE',
          },
        });

        return result;
      });

      return toResourceDto(updated);
    });
  }
}

export const resourceService = new ResourceService();
