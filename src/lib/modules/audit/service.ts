import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { auditRepository } from './repository';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { AuditLog } from '@prisma/client';

export class AuditService extends BaseService {
  constructor() {
    super('AuditService');
  }

  async listAuditLogs(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<AuditLog>> {
    return this.execute('listAuditLogs', ctx, async () => {
      // Must be a system or super admin to view audit logs
      this.enforceSuperAdmin(ctx);

      const filter = {
        ...(ctx.venueId !== 'GLOBAL' ? { venueId: ctx.venueId } : {}),
      };

      return auditRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort || [{ field: 'createdAt', order: 'desc' }],
      });
    });
  }

  async createAuditLog(
    ctx: BusinessContext,
    data: any
  ): Promise<AuditLog> {
    return this.execute('createAuditLog', ctx, async () => {
      return auditRepository.create(data);
    });
  }
}

export const auditService = new AuditService();
