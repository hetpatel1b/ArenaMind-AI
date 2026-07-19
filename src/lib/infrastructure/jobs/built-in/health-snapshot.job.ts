import { IRunnableJob } from '../job.interface';
import { diagnostics } from '../../monitoring/diagnostics';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export const HealthSnapshotJob: IRunnableJob = {
  name: 'infra:health-snapshot',

  async execute() {
    const report = await diagnostics.checkAll();
    LoggerService.info(`[HealthSnapshotJob] Current systemic health: ${report.status}`);
  },
};
