import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { config } from '@/lib/platform/config/ConfigurationService';

const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL || config.databaseUrl,
    max: 20, // Connection pooling limit
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

  // Slow query detection (N+1 detection in logs)
  client.$on('query', (e: any) => {
    if (e.duration >= 100) {
      // Log queries taking longer than 100ms
      console.warn(`[SLOW QUERY] Duration: ${e.duration}ms | Query: ${e.query}`);
    }
  });

  return client;
};

declare global {
  var prismaClientGlobalInstance: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaClientGlobalInstance ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaClientGlobalInstance = prisma;
