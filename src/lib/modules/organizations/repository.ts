import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Organization } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class OrganizationRepository extends PrismaRepository<Organization, any, any> {
  constructor() {
    super(prisma.organization as any);
  }
}

export const organizationRepository = new OrganizationRepository();
