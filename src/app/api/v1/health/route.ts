import { createRouteHandler } from '@/lib/api/route-factory';
import { successResponse } from '@/lib/api/response';
import { prisma } from '@/lib/db/client';

export const GET = createRouteHandler(
  async () => {
    // Basic DB ping to ensure connection pool is healthy
    const dbStatus = await prisma.$queryRaw`SELECT 1 as result`
      .then(() => 'up')
      .catch(() => 'down');

    return successResponse({
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  },
  { requireAuth: false, globalAccess: true }
);
