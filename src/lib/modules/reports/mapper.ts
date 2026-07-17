import { Report } from '@prisma/client';
import { ReportDto } from './dto';

export function toReportDto(report: Report): ReportDto {
  return {
    id: report.id,
    venueId: report.venueId as string,
    matchId: report.matchId,
    userId: report.userId,
    type: report.type,
    generatedAt: report.generatedAt,
  };
}
