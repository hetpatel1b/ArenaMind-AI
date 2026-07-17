import { LoggerService } from './LoggerService';

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface AlertEvent {
  name: string;
  severity: AlertSeverity;
  message: string;
  context?: any;
  timestamp: string;
}

export class AlertManager {
  private static alerts: AlertEvent[] = [];

  static triggerAlert(name: string, severity: AlertSeverity, message: string, context?: any) {
    const alert: AlertEvent = {
      name,
      severity,
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    this.alerts.push(alert);

    // In a real scenario, this would post to Slack/PagerDuty/Opsgenie
    const logContext = { alertName: name, severity, ...context };

    switch (severity) {
      case AlertSeverity.CRITICAL:
        LoggerService.fatal(`[CRITICAL ALERT] ${name}: ${message}`, undefined, logContext);
        break;
      case AlertSeverity.WARNING:
        LoggerService.warn(`[WARNING ALERT] ${name}: ${message}`, logContext);
        break;
      case AlertSeverity.INFO:
        LoggerService.info(`[INFO ALERT] ${name}: ${message}`, logContext);
        break;
    }
  }

  static getActiveAlerts() {
    return this.alerts;
  }
}
