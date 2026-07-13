import { logger } from '@/lib/observability/logger';
import { auditLogger } from '@/lib/observability/audit-logger';

export class MaintenanceManager {
  private active = false;
  private reason = '';

  enable(reason: string, adminUserId: string) {
    this.active = true;
    this.reason = reason;

    logger.warn('Maintenance mode ENABLED', { reason, adminUserId });
    auditLogger.log({
      recordId: 'MAINTENANCE_TOGGLE',
      action: 'ENABLE_MAINTENANCE_MODE',
      userId: adminUserId,
      metadata: { reason },
    });
  }

  disable(adminUserId: string) {
    this.active = false;
    this.reason = '';

    logger.info('Maintenance mode DISABLED', { adminUserId });
    auditLogger.log({
      recordId: 'MAINTENANCE_TOGGLE',
      action: 'DISABLE_MAINTENANCE_MODE',
      userId: adminUserId,
    });
  }

  isActive() {
    return this.active;
  }

  getReason() {
    return this.reason;
  }
}

export const maintenanceManager = new MaintenanceManager();
