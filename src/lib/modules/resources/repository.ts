import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Resource } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class ResourceRepository extends PrismaRepository<Resource, SafeAny, SafeAny> {
  constructor() {
    super(prisma.resource, 'resource');
  }
}

export const resourceRepository = new ResourceRepository();
