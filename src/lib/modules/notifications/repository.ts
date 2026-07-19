import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Notification } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class NotificationRepository extends PrismaRepository<Notification, SafeAny, SafeAny> {
  constructor() {
    super(prisma.notification, 'notification');
  }
}

export const notificationRepository = new NotificationRepository();
