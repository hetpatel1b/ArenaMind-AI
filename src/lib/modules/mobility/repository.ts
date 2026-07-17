import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { MobilitySnapshot } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class MobilityRepository extends PrismaRepository<MobilitySnapshot, any, any> {
  constructor() {
    super(prisma.mobilitySnapshot as any);
  }
}

export const mobilityRepository = new MobilityRepository();
