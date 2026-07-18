import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Venue } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class StadiumRepository extends PrismaRepository<Venue, any, any> {
  constructor() {
    super(prisma.venue, 'venue');
  }
}

export const stadiumRepository = new StadiumRepository();
