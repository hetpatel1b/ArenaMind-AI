import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { reportRepository } from './repository';
import { toReportDto } from './mapper';
import { ReportDto, CreateReportDto } from './dto';
import { QueryParamsDTO, extractAllowedFilters } from '@/lib/api/dto';
import { PaginatedResult } from '@/types/api.types';
import { AuthenticationError, NotFoundError } from '@/lib/errors/http.errors';
import { prisma } from '@/lib/db/client';

export class ReportService extends BaseService {
  constructor() {
    super('ReportService');
  }

  async listMatchReports(
    ctx: BusinessContext,
    matchId: string,
    query: QueryParamsDTO
  ): Promise<PaginatedResult<ReportDto>> {
    return this.execute('listMatchReports', ctx, async () => {
      const userFilters = extractAllowedFilters(query.filters, ['type', 'userId']);

      const filter = {
        matchId,
        ...(ctx.stadiumId !== 'GLOBAL' ? { stadiumId: ctx.stadiumId } : {}),
        ...userFilters,
      };

      const { data, meta } = await reportRepository.findAll({
        filter,
        pagination: query.pagination,
        sort: query.sort || [{ field: 'generatedAt', order: 'desc' }], // default latest first
      });

      return {
        data: data.map(toReportDto),
        meta,
      };
    });
  }

  async createReport(
    ctx: BusinessContext,
    matchId: string,
    payload: CreateReportDto
  ): Promise<ReportDto> {
    return this.execute('createReport', ctx, async () => {
      if (!ctx.userId) throw new AuthenticationError('User ID is missing from context');

      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) throw new NotFoundError('Match not found');

      this.enforceTenantIsolation(ctx, match.stadiumId);

      const createdReport = await prisma.$transaction(async (tx) => {
        // Create the report record representing the generation event
        const report = await tx.report.create({
          data: {
            stadiumId: match.stadiumId,
            matchId: match.id,
            userId: ctx.userId!,
            type: payload.type,
          },
        });

        await tx.auditLog.create({
          data: {
            recordId: report.id,
            tableName: 'unknown',
            action: 'CREATE_REPORT',
          },
        });

        return report;
      });

      return toReportDto(createdReport);
    });
  }
}

export const reportService = new ReportService();
