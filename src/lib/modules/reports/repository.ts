import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Report } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class ReportRepository extends PrismaRepository<Report, any, any> {
  constructor() {
    super(prisma.report as any);
  }
}

export const reportRepository = new ReportRepository();
