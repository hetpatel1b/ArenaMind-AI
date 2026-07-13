import { NextResponse } from 'next/server';
import { diagnostics } from '@/lib/infrastructure/monitoring/diagnostics';

export async function GET() {
  // Readiness probe: Checks if DB is ready to accept traffic
  const dbHealth = await diagnostics.checkDatabase();

  if (dbHealth.status === 'up') {
    return new NextResponse('OK', { status: 200 });
  } else {
    return new NextResponse('Service Unavailable', { status: 503 });
  }
}
