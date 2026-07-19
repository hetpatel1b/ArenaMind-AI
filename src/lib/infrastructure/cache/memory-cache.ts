import { ICache, ICacheOptions } from './cache.interface';

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

export class MemoryCache implements ICache {
  private store = new Map<string, CacheEntry<SafeAny>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, options?: ICacheOptions): Promise<void> {
    const expiresAt = options?.ttlSeconds ? Date.now() + options.ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export const memoryCache = new MemoryCache();
