import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { alertRepository } from './repository';
import { toAlertDto } from './mapper';
import { AlertDto, CreateAlertDto, UpdateAlertDto } from './dto';
import { QueryParamsDTO, extractAllowedFilters } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { AuthenticationError, NotFoundError } from '@/lib/errors/http.errors';
import { prisma } from '@/lib/db/client';

export class AlertService extends BaseService {
  constructor() {
    super('AlertService');
  }

  async listMatchAlerts(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<AlertDto>> {
    return this.execute('listMatchAlerts', ctx, async () => {
      if (!ctx.userId) throw new AuthenticationError('User ID is missing from context');

      const userFilters = extractAllowedFilters(query.filters, ['type']);

      if (query.search?.query) {
        userFilters.OR = [
          { title: { contains: query.search.query, mode: 'insensitive' } },
          { body: { contains: query.search.query, mode: 'insensitive' } },
        ];
      }

      const filter = { matchId, userId: ctx.userId, ...userFilters };

      const { data, meta } = await alertRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort || [{ field: 'createdAt', order: 'desc' }], // default sort newest first
      });

      return {
        data: data.map(toAlertDto),
        meta,
      };
    });
  }

  async createAlert(
    ctx: BusinessContext,
    matchId: string,
    payload: CreateAlertDto
  ): Promise<AlertDto> {
    return this.execute('createAlert', ctx, async () => {
      if (!ctx.userId) throw new AuthenticationError('User ID is missing from context');

      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) throw new NotFoundError('Match not found');
      this.enforceTenantIsolation(ctx, match.venueId);

      const targetUserId = payload.userId || ctx.userId; // Default to self if not specified

      const createdNotification = await prisma.$transaction(async (tx) => {
        const notification = await tx.notification.create({
          data: {
            userId: targetUserId,
            matchId,
            type: payload.type,
            title: payload.title,
            body: payload.body,
            data: payload.data || {},
          },
        });

        await tx.auditLog.create({
          data: {
            recordId: notification.id,
            tableName: 'unknown',
            action: 'CREATE_ALERT',
          },
        });

        return notification;
      });

      return toAlertDto(createdNotification);
    });
  }

  async acknowledgeAlert(
    ctx: BusinessContext,
    matchId: string,
    alertId: string,
    payload: UpdateAlertDto
  ): Promise<AlertDto> {
    return this.execute('acknowledgeAlert', ctx, async () => {
      const updated = await prisma.$transaction(async (tx) => {
        const notif = await tx.notification.findUnique({ where: { id: alertId } });
        if (!notif || notif.matchId !== matchId) {
          throw new NotFoundError('Alert not found');
        }

        const data = (notif.data as Record<string, unknown>) || {};
        if ((payload as Record<string, unknown>)?.acknowledged !== undefined) {
          data.acknowledged = (payload as Record<string, unknown>)?.acknowledged;
          data.acknowledgedAt = new Date().toISOString();
          data.acknowledgedBy = ctx.userId;
        }

        const updatedNotif = await tx.notification.update({
          where: { id: alertId },
          data: { data: data as import('@prisma/client').Prisma.InputJsonValue },
        });

        await tx.auditLog.create({
          data: {
            recordId: updatedNotif.id,
            tableName: 'unknown',
            action: 'ACKNOWLEDGE_ALERT',
          },
        });

        return updatedNotif;
      });

      return toAlertDto(updated);
    });
  }
}

export const alertService = new AlertService();
