import { prisma } from '@/lib/db/client';
import { AuditService } from '../audit/audit.service';

export class OrganizationService {
  static async getOrganization(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        venues: true,
      },
    });
  }

  static async getOrganizations() {
    return prisma.organization.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async createOrganization(data: any, createdById: string) {
    const org = await prisma.organization.create({
      data: {
        ...data,
        createdById,
      },
    });

    await AuditService.log({
      tableName: 'Organization',
      recordId: org.id,
      action: 'CREATE',
      userId: createdById,
      newData: org,
    });

    return org;
  }
}
