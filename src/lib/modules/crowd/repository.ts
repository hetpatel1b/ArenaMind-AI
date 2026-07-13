import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { CrowdData } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class CrowdDataRepository extends PrismaRepository<CrowdData, any, any> {
  constructor() {
    super(prisma.crowdData as any);
  }
}

export const crowdDataRepository = new CrowdDataRepository();
