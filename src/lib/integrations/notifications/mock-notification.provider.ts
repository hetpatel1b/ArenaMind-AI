import { INotificationProvider, EmailPayload, SmsPayload } from './notification.interface';
import { logger } from '@/lib/observability/logger';

export class MockNotificationProvider implements INotificationProvider {
  async sendEmail(payload: EmailPayload): Promise<void> {
    logger.info('Mock Email Sent', { to: payload.to, subject: payload.subject });
  }

  async sendSms(payload: SmsPayload): Promise<void> {
    logger.info('Mock SMS Sent', { to: payload.phoneNumber });
  }
}

export const notificationProvider: INotificationProvider = new MockNotificationProvider();
