import { prisma } from '@/lib/db/client';

export class DatabaseMonitor {
  static async getStats() {
    let activeConnections = 0;
    const slowQueries = 0;
    const failedQueries = 0;
    let dbSize = 0;

    try {
      // Postgres specific connection count
      interface PgStatActivityCount {
        count: bigint | number;
      }
      const result = await prisma.$queryRaw<
        PgStatActivityCount[]
      >`SELECT count(*) as count FROM pg_stat_activity`;
      const firstResult = result[0];
      if (result && result.length > 0 && firstResult) {
        activeConnections = Number(firstResult.count);
      }

      // Try to get DB size
      interface PgDatabaseSize {
        size: bigint | number;
      }
      const sizeResult = await prisma.$queryRaw<
        PgDatabaseSize[]
      >`SELECT pg_database_size(current_database()) as size`;
      const firstSize = sizeResult[0];
      if (sizeResult && sizeResult.length > 0 && firstSize) {
        dbSize = Number(firstSize.size);
      }
    } catch (e) {
      // graceful fallback
    }

    return {
      activeConnections,
      slowQueries,
      failedQueries,
      connectionPoolStatus: activeConnections < 80 ? 'HEALTHY' : 'WARNING',
      migrationVersion: 'latest', // Ideally parsed from prisma migrations table
      databaseSize: dbSize,
      healthScore: activeConnections < 80 ? 100 : 70,
    };
  }
}
