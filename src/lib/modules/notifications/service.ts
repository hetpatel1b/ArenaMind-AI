import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { notificationRepository } from './repository';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { Notification } from '@prisma/client';

export class NotificationService extends BaseService {
  constructor() {
    super('NotificationService');
  }

  async listNotifications(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<Notification>> {
    return this.execute('listNotifications', ctx, async () => {
      const filter = {
        userId: ctx.userId, // Only their notifications
      };

      return notificationRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: [{ field: 'createdAt', order: 'desc' }],
      });
    });
  }
}

export const notificationService = new NotificationService();
