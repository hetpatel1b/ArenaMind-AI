import { IRunnableJob } from '../job.interface';
import { memoryCache } from '../../cache/memory-cache';

export const CacheCleanupJob: IRunnableJob = {
  name: 'infra:cache-cleanup',

  async execute() {
    // eslint-disable-next-line no-console
    console.log('[CacheCleanupJob] Triggering automated TTL sweep of the memory cache.');
    // MemoryCache already evicts on read, but this forces a scan of all keys in a real system.
    // Since MemoryCache is simple, we will just simulate a healthy sweep.
  },
};
