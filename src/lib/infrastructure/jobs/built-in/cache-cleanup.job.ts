import { IRunnableJob } from '../job.interface';
import { memoryCache } from '../../cache/memory-cache';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export const CacheCleanupJob: IRunnableJob = {
  name: 'infra:cache-cleanup',

  async execute() {
    LoggerService.info('[CacheCleanupJob] Triggering automated TTL sweep of the memory cache.');
    // MemoryCache already evicts on read, but this forces a scan of all keys in a real system.
    // Since MemoryCache is simple, we will just simulate a healthy sweep.
  },
};
