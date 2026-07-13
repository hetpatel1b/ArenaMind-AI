import { IRunnableJob } from '../job.interface';
import { diagnostics } from '../../monitoring/diagnostics';

export const HealthSnapshotJob: IRunnableJob = {
  name: 'infra:health-snapshot',

  async execute() {
    const report = await diagnostics.checkAll();
    // eslint-disable-next-line no-console
    console.log(`[HealthSnapshotJob] Current systemic health: ${report.status}`);
  },
};
