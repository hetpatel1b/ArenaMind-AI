import 'server-only';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { config } from '@/lib/platform/config/ConfigurationService';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || config.databaseUrl;
  const isProduction =
    process.env.NODE_ENV === 'production' || connectionString?.includes('supabase.com');

  const pool = new Pool({
    connectionString,
    max: 10, // Lowered per-instance pool limit to prevent Vercel from exhausting global Supabase connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased to prevent false connection drops on cold starts
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
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
  client.$on('query', (e: SafeAny) => {
    if (e.duration >= 100) {
      // Log queries taking longer than 100ms
      LoggerService.warn(`[SLOW QUERY] Duration: ${e.duration}ms | Query: ${e.query}`);
    }
  });

  return client;
};

declare global {
  var prismaClientGlobalInstance: undefined | ReturnType<typeof prismaClientSingleton>;
}

export let prisma: PrismaClient;

if (process.env.NEXT_PUBLIC_E2E_MODE === 'true') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  prisma = require('../../../tests/e2e/mocks/prisma.mock').prismaMock;
} else {
  prisma = globalThis.prismaClientGlobalInstance ?? (prismaClientSingleton() as SafeAny);
  if (process.env.NODE_ENV !== 'production')
    globalThis.prismaClientGlobalInstance = prisma as SafeAny;
}
