import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Notification } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class AlertRepository extends PrismaRepository<Notification, any, any> {
  constructor() {
    super(prisma.notification as any);
  }
}

export const alertRepository = new AlertRepository();
