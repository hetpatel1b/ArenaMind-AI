import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { KpiSnapshot } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class KpiSnapshotRepository extends PrismaRepository<KpiSnapshot, any, any> {
  constructor() {
    super(prisma.kpiSnapshot, 'kpiSnapshot');
  }
}

export const kpiSnapshotRepository = new KpiSnapshotRepository();
