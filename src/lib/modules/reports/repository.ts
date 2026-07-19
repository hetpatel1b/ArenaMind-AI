import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Report } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class ReportRepository extends PrismaRepository<Report, SafeAny, SafeAny> {
  constructor() {
    super(prisma.report, 'report');
  }
}

export const reportRepository = new ReportRepository();
