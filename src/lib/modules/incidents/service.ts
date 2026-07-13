import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { incidentRepository } from './repository';
import { toIncidentDto } from './mapper';
import { IncidentDto, CreateIncidentDto, UpdateIncidentDto } from './dto';
import { NotFoundError, ValidationError } from '@/lib/errors/http.errors';
import { QueryParamsDTO, extractAllowedFilters } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { prisma } from '@/lib/db/client';

export class IncidentService extends BaseService {
  constructor() {
    super('IncidentService');
  }

  async getIncidentById(
    ctx: BusinessContext,
    matchId: string,
    incidentId: string
  ): Promise<IncidentDto> {
    return this.execute('getIncidentById', ctx, async () => {
      const incident = await incidentRepository.findById(incidentId);
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
      // Safe query validation and extraction using shared utility
      const userFilters = extractAllowedFilters(
        query.filters,
        ['status', 'severityTier', 'zoneId', 'reportedBy', 'incidentTypeId'],
        { severityTier: (val) => parseInt(String(val), 10) }
      );

      // Add full-text search (case-insensitive partial matching)
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

      const { data, meta } = await incidentRepository.findAll({
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

      // Verify Match exists and belongs to the active tenant
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) throw new NotFoundError('Match not found');
      this.enforceTenantIsolation(ctx, match.stadiumId);

      // Perform a transaction to create the incident and its first audit action
      const incident = await prisma.$transaction(async (tx) => {
        const newIncident = await tx.incident.create({
          data: {
            matchId,
            stadiumId: match.stadiumId,
            reportedBy: ctx.userId!,
            title: payload.title,
            description: payload.description,
            zoneId: payload.zoneId,
            incidentTypeId: payload.incidentTypeId,
            locationDetail: payload.locationDetail,
            severityTier: payload.severityTier,
            tags: payload.tags,
            status: 'open',
          },
        });

        await tx.incidentAction.create({
          data: {
            incidentId: newIncident.id,
            userId: ctx.userId!,
            // Since we can't add an arbitrary 'action' column string without updating Prisma schema,
            // the IncidentAction table natively records that an action occurred via its presence.
          },
        });

        return newIncident;
      });

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

      // Validate existence and tenant
      const existing = await incidentRepository.findById(incidentId);
      if (!existing || existing.matchId !== matchId) {
        throw new NotFoundError('Incident not found');
      }
      this.enforceTenantIsolation(ctx, existing.stadiumId);

      // Protect resolved incidents from casual updates unless explicitly reopening
      if (['resolved', 'closed'].includes(existing.status) && !payload.status) {
        throw new ValidationError('Cannot modify a resolved incident without reopening it.');
      }

      // Prepare updates
      const updateData: any = { ...payload };
      if (payload.status === 'resolved' || payload.status === 'closed') {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = ctx.userId;
      }

      const updated = await prisma.$transaction(async (tx) => {
        const result = await tx.incident.update({
          where: { id: incidentId },
          data: updateData,
        });

        // Audit log
        await tx.incidentAction.create({
          data: {
            incidentId: result.id,
            userId: ctx.userId!,
          },
        });

        return result;
      });

      return toIncidentDto(updated);
    });
  }
}

export const incidentService = new IncidentService();
