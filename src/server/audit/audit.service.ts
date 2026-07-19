import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export interface AuditLogEntry {
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ACCESS';
  userId?: string;
  organizationId?: string;
  oldData?: Prisma.InputJsonValue;
  newData?: Prisma.InputJsonValue;
  ipAddress?: string;
  browser?: string;
  device?: string;
}

export class AuditService {
  /**
   * Logs an action in the audit trail.
   */
  static async log(entry: AuditLogEntry) {
    try {
      await prisma.auditLog.create({
        data: {
          tableName: entry.tableName,
          recordId: entry.recordId,
          action: entry.action,
          userId: entry.userId,
          organizationId: entry.organizationId,
          oldData: entry.oldData,
          newData: entry.newData,
          ipAddress: entry.ipAddress,
          browser: entry.browser,
          device: entry.device,
        },
      });
    } catch (error) {
      // In production, we'd want to alert on this without failing the primary transaction
      LoggerService.error('Failed to write audit log:', error);
    }
  }
}
