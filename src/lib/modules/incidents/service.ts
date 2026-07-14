import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { toIncidentDto } from './mapper';
import { IncidentDto, CreateIncidentDto, UpdateIncidentDto } from './dto';
import { NotFoundError, ValidationError } from '@/lib/errors/http.errors';
import { QueryParamsDTO, extractAllowedFilters } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { IIncidentRepository } from '@/lib/domain/repositories/incident.repository.interface';
import { IMatchRepository } from '@/lib/domain/repositories/match.repository.interface';

export class IncidentService extends BaseService {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly matchRepository: IMatchRepository
  ) {
    super('IncidentService');
  }

  async getIncidentById(
    ctx: BusinessContext,
    matchId: string,
    incidentId: string
  ): Promise<IncidentDto> {
    return this.execute('getIncidentById', ctx, async () => {
      const incident = await this.incidentRepository.findById(incidentId);
      if (!incident || incident.matchId !== matchId) {
        throw new NotFoundError(`Incident with ID ${incidentId} not found`);
      }

      this.enforceTenantIsolation(ctx, incident.stadiumId);

      return toIncidentDto(incident);
    });
  }

  async listMatchIncidents(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<IncidentDto>> {
    return this.execute('listMatchIncidents', ctx, async () => {
      const userFilters = extractAllowedFilters(
        query.filters,
        ['status', 'severityTier', 'zoneId', 'reportedBy', 'incidentTypeId'],
        { severityTier: (val) => parseInt(String(val), 10) }
      );

      if (query.search?.query) {
        userFilters.OR = [
          { title: { contains: query.search.query, mode: 'insensitive' } },
          { description: { contains: query.search.query, mode: 'insensitive' } },
        ];
      }

      const filter = {
        matchId,
        ...(ctx.stadiumId !== 'GLOBAL' ? { stadiumId: ctx.stadiumId } : {}),
        ...userFilters,
      };

      const { data, meta } = await this.incidentRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort,
      });

      return {
        data: data.map(toIncidentDto),
        meta,
      };
    });
  }

  async createIncident(
    ctx: BusinessContext,
    matchId: string,
    payload: CreateIncidentDto
  ): Promise<IncidentDto> {
    return this.execute('createIncident', ctx, async () => {
      if (!ctx.userId) throw new Error('User ID required to create incident');

      const match = await this.matchRepository.findById(matchId);
      if (!match) throw new NotFoundError('Match not found');
      this.enforceTenantIsolation(ctx, match.stadiumId);

      const incident = await this.incidentRepository.createIncidentWithAction(
        matchId,
        match.stadiumId,
        ctx.userId,
        payload
      );

      return toIncidentDto(incident);
    });
  }

  async updateIncident(
    ctx: BusinessContext,
    matchId: string,
    incidentId: string,
    payload: UpdateIncidentDto
  ): Promise<IncidentDto> {
    return this.execute('updateIncident', ctx, async () => {
      if (!ctx.userId) throw new Error('User ID required to update incident');

      const existing = await this.incidentRepository.findById(incidentId);
      if (!existing || existing.matchId !== matchId) {
        throw new NotFoundError('Incident not found');
      }
      this.enforceTenantIsolation(ctx, existing.stadiumId);

      if (['resolved', 'closed'].includes(existing.status) && !payload.status) {
        throw new ValidationError('Cannot modify a resolved incident without reopening it.');
      }

      const updated = await this.incidentRepository.updateIncidentWithAction(
        incidentId,
        ctx.userId,
        payload
      );

      return toIncidentDto(updated);
    });
  }
}

// Temporary export for backward compatibility during refactoring
import { incidentRepository } from './repository';
import { matchRepository } from '../matches/repository';
export const incidentService = new IncidentService(incidentRepository, matchRepository);
