import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { InfrastructureNode } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class InfrastructureRepository extends PrismaRepository<
  InfrastructureNode,
  SafeAny,
  SafeAny
> {
  constructor() {
    super(prisma.infrastructureNode, 'infrastructureNode');
  }
}

export const infrastructureRepository = new InfrastructureRepository();
