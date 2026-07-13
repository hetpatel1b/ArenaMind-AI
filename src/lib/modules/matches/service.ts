import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { matchRepository } from './repository';
import { toMatchDto } from './mapper';
import { MatchDto, UpdateMatchDto } from './dto';
import { NotFoundError } from '@/lib/errors/http.errors';
import { QueryParamsDTO } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { prisma } from '@/lib/db/client';

export class MatchService extends BaseService {
  constructor() {
    super('MatchService');
  }

  async getMatchById(ctx: BusinessContext, id: string): Promise<MatchDto> {
    return this.execute('getMatchById', ctx, async () => {
      const match = await matchRepository.findById(id);
      if (!match) {
        throw new NotFoundError(`Match with ID ${id} not found`);
      }

      // Enforce tenant isolation: user can only access matches at their stadium
      this.enforceTenantIsolation(ctx, match.stadiumId);

      return toMatchDto(match);
    });
  }

  async listMatches(
    ctx: BusinessContext,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<MatchDto>> {
    return this.execute('listMatches', ctx, async () => {
      const filter = ctx.stadiumId !== 'GLOBAL' ? { stadiumId: ctx.stadiumId } : {};

      const { data, meta } = await matchRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort,
      });

      return {
        data: data.map(toMatchDto),
        meta,
      };
    });
  }

  async updateMatch(
    ctx: BusinessContext,
    matchId: string,
    payload: UpdateMatchDto
  ): Promise<MatchDto> {
    return this.execute('updateMatch', ctx, async () => {
      if (!ctx.userId) throw new Error('User ID is required to update match');

      const existing = await matchRepository.findById(matchId);
      if (!existing) throw new NotFoundError('Match not found');

      this.enforceTenantIsolation(ctx, existing.stadiumId);

      const updated = await prisma.$transaction(async (tx) => {
        // If phase changed, log the transition
        if (payload.currentPhase && payload.currentPhase !== existing.currentPhase) {
          await tx.phaseTransition.create({
            data: {
              matchId: existing.id,
              fromPhase: existing.currentPhase,
              toPhase: payload.currentPhase,
              initiatedBy: ctx.userId!,
            },
          });
        }

        const result = await tx.match.update({
          where: { id: existing.id },
          data: {
            ...payload,
          },
          include: {
            stadium: true,
          },
        });

        return result;
      });

      return toMatchDto(updated);
    });
  }
}

export const matchService = new MatchService();
