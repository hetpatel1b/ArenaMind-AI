import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Stadium } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class StadiumRepository extends PrismaRepository<Stadium, any, any> {
  constructor() {
    super(prisma.stadium as any);
  }
}

export const stadiumRepository = new StadiumRepository();
