import { createRouteHandler } from '@/lib/api/route-factory';
import { HealthService } from '@/lib/platform/health/HealthService';
import { NextResponse } from 'next/server';

export const GET = createRouteHandler(
  async () => {
    const result = await HealthService.checkHealth();
    // Return early with custom NextResponse to allow setting 503 status
    // since createRouteHandler typically returns 200 for successResponse
    return NextResponse.json(result, {
      status: result.status === 'down' ? 503 : 200,
    }) as any;
  },
  { requireAuth: false, globalAccess: true }
);
