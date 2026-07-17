import { NextResponse } from 'next/server';
import { HealthService } from '@/lib/platform/health/HealthService';

export async function GET() {
  const result = await HealthService.checkHealth();

  if (result.status === 'down') {
    return NextResponse.json({ status: 'not_ready', error: 'Dependencies down' }, { status: 503 });
  }

  return NextResponse.json({ status: 'ready' }, { status: 200 });
}
