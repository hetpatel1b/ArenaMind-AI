import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { WorkforceUnit } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class WorkforceRepository extends PrismaRepository<WorkforceUnit, any, any> {
  constructor() {
    super(prisma.workforceUnit as any);
  }
}

export const workforceRepository = new WorkforceRepository();
