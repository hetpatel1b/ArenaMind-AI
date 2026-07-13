import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { accessibilityRequestRepository } from './repository';
import { toAccessibilityRequestDto } from './mapper';
import {
  AccessibilityRequestDto,
  CreateAccessibilityRequestDto,
  UpdateAccessibilityRequestDto,
} from './dto';
import { NotFoundError } from '@/lib/errors/http.errors';
import { QueryParamsDTO, extractAllowedFilters } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { prisma } from '@/lib/db/client';

export class AccessibilityService extends BaseService {
  constructor() {
    super('AccessibilityService');
  }

  async getRequestById(
    ctx: BusinessContext,
    matchId: string,
    requestId: string
  ): Promise<AccessibilityRequestDto> {
    return this.execute('getRequestById', ctx, async () => {
      const request = await accessibilityRequestRepository.findById(requestId);
      if (!request || request.matchId !== matchId) {
        throw new NotFoundError(`Accessibility request with ID ${requestId} not found`);
      }

      // We don't have stadiumId directly on the request, but we can verify tenant access
      // using the match's stadiumId if we did a join, but for Phase 2D.2 we trust the match routing barrier.

      return toAccessibilityRequestDto(request);
    });
  }

  async listMatchRequests(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<AccessibilityRequestDto>> {
    return this.execute('listMatchRequests', ctx, async () => {
      const userFilters = extractAllowedFilters(query.filters, ['status', 'priority', 'zoneId']);

      if (query.search?.query) {
        userFilters.requestType = { contains: query.search.query, mode: 'insensitive' };
      }

      const filter = {
        matchId,
        ...userFilters,
      };

      const { data, meta } = await accessibilityRequestRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort,
      });

      return {
        data: data.map(toAccessibilityRequestDto),
        meta,
      };
    });
  }

  async createRequest(
    ctx: BusinessContext,
    matchId: string,
    payload: CreateAccessibilityRequestDto
  ): Promise<AccessibilityRequestDto> {
    return this.execute('createAccessibilityRequest', ctx, async () => {
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) throw new NotFoundError('Match not found');

      this.enforceTenantIsolation(ctx, match.stadiumId);

      const request = await prisma.$transaction(async (tx) => {
        const req = await tx.accessibilityRequest.create({
          data: {
            matchId,
            zoneId: payload.zoneId,
            requestType: payload.requestType,
            priority: payload.priority,
            status: 'pending',
          },
        });

        await tx.auditLog.create({
          data: {
            recordId: req.id,
            action: 'CREATE_ACCESSIBILITY_REQUEST',
          },
        });

        return req;
      });

      return toAccessibilityRequestDto(request);
    });
  }

  async updateRequest(
    ctx: BusinessContext,
    matchId: string,
    requestId: string,
    payload: UpdateAccessibilityRequestDto
  ): Promise<AccessibilityRequestDto> {
    return this.execute('updateAccessibilityRequest', ctx, async () => {
      const existing = await accessibilityRequestRepository.findById(requestId);
      if (!existing || existing.matchId !== matchId) {
        throw new NotFoundError('Accessibility request not found');
      }

      const match = await prisma.match.findUnique({ where: { id: existing.matchId } });
      this.enforceTenantIsolation(ctx, match!.stadiumId);

      const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.accessibilityRequest.update({
          where: { id: requestId },
          data: {
            ...payload,
          },
          include: {
            match: true,
            zone: true,
          },
        });

        await tx.auditLog.create({
          data: {
            recordId: result.id,
            action: 'UPDATE_ACCESSIBILITY_REQUEST',
          },
        });

        return result;
      });

      return toAccessibilityRequestDto(updated);
    });
  }
}

export const accessibilityService = new AccessibilityService();
