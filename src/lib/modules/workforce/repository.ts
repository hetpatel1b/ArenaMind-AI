import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { WorkforceUnit } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class WorkforceRepository extends PrismaRepository<WorkforceUnit, SafeAny, SafeAny> {
  constructor() {
    super(prisma.workforceUnit, 'workforceUnit');
  }
}

export const workforceRepository = new WorkforceRepository();
