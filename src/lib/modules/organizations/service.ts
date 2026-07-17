import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { organizationRepository } from './repository';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { Organization } from '@prisma/client';

export class OrganizationService extends BaseService {
  constructor() {
    super('OrganizationService');
  }

  async listOrganizations(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<Organization>> {
    return this.execute('listOrganizations', ctx, async () => {
      // Must be a super admin to list all organizations
      this.enforceSuperAdmin(ctx);

      return organizationRepository.findAll({
        pagination: query.pagination,
        sort: query.sort || [{ field: 'name', order: 'asc' }],
      });
    });
  }

  async getOrganizationById(
    ctx: BusinessContext,
    id: string
  ): Promise<Organization | null> {
    return this.execute('getOrganizationById', ctx, async () => {
      // Can only fetch their own org unless super admin
      if (ctx.role !== 'super_admin' && ctx.organizationId !== id) {
        throw new Error('Unauthorized access to organization');
      }

      return organizationRepository.findById(id);
    });
  }
}

export const organizationService = new OrganizationService();
