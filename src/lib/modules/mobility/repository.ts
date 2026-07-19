import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { MobilitySnapshot } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class MobilityRepository extends PrismaRepository<MobilitySnapshot, SafeAny, SafeAny> {
  constructor() {
    super(prisma.mobilitySnapshot, 'mobilitySnapshot');
  }
}

export const mobilityRepository = new MobilityRepository();
