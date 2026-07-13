import { prisma } from '@/lib/db/client';
import { logger } from './logger';

export interface AuditEventPayload {
  recordId: string;
  action: string;
  userId?: string;
  metadata?: any;
}

export class AuditLogger {
  async log(payload: AuditEventPayload) {
    try {
      await prisma.auditLog.create({
        data: {
          recordId: payload.recordId,
          action: payload.action,
        },
      });
      // Emit to structured logger for SIEM ingestion (e.g. Splunk)
      logger.info('Audit Event Logged', { audit: payload });
    } catch (error) {
      logger.error('Failed to write audit log to database', { auditPayload: payload, error });
    }
  }
}

export const auditLogger = new AuditLogger();
