import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { AuditLog } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class AuditRepository extends PrismaRepository<AuditLog, any, any> {
  constructor() {
    super(prisma.auditLog, 'auditLog');
  }
}

export const auditRepository = new AuditRepository();
