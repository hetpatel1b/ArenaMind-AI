import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Match } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class MatchRepository extends PrismaRepository<Match, any, any> {
  constructor() {
    super(prisma.match, 'match');
  }
}

export const matchRepository = new MatchRepository();
