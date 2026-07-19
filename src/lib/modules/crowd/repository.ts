import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { CrowdSnapshot } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class CrowdSnapshotRepository extends PrismaRepository<CrowdSnapshot, SafeAny, SafeAny> {
  constructor() {
    super(prisma.crowdSnapshot, 'crowdSnapshot');
  }
}

export const crowdSnapshotRepository = new CrowdSnapshotRepository();
