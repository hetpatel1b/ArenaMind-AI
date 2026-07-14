import { INotificationProvider, EmailPayload, SmsPayload } from './notification.interface';
import { prisma } from '@/lib/db/client';
import { logger } from '@/lib/observability/logger';
import { adminSupabase } from '@/lib/supabase/admin';

export class PrismaNotificationProvider implements INotificationProvider {
  async sendEmail(payload: EmailPayload): Promise<void> {
    // In Phase 5.3, we simulate email sending by logging it and persisting a generic notification
    logger.info('Simulating Email Send via Postgres', { to: payload.to, subject: payload.subject });

    const user = await prisma.user.findFirst();

    if (user) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'email',
          title: payload.subject,
          body: payload.bodyHtml,
          data: { to: payload.to },
        },
      });
      // Optionally broadcast via Realtime
      adminSupabase.channel('system_notifications').send({
        type: 'broadcast',
        event: 'email_sent',
        payload: { subject: payload.subject },
      });
    }
  }

  async sendSms(payload: SmsPayload): Promise<void> {
    logger.info('Simulating SMS Send via Postgres', { to: payload.phoneNumber });

    const user = await prisma.user.findFirst();

    if (user) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'sms',
          title: 'SMS Alert',
          body: payload.message,
          data: { phone: payload.phoneNumber },
        },
      });

      adminSupabase.channel('system_notifications').send({
        type: 'broadcast',
        event: 'sms_sent',
        payload: { message: payload.message },
      });
    }
  }
}

export const notificationProvider: INotificationProvider = new PrismaNotificationProvider();
