import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Organization } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class OrganizationRepository extends PrismaRepository<Organization, SafeAny, SafeAny> {
  constructor() {
    super(prisma.organization, 'organization');
  }
}

export const organizationRepository = new OrganizationRepository();
