import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { InfrastructureNode } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class InfrastructureRepository extends PrismaRepository<InfrastructureNode, any, any> {
  constructor() {
    super(prisma.infrastructureNode as any);
  }
}

export const infrastructureRepository = new InfrastructureRepository();
