import { NextResponse } from 'next/server';
import { diagnostics } from '@/lib/infrastructure/monitoring/diagnostics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const report = await diagnostics.checkAll();

  return NextResponse.json(report, {
    status: report.status === 'ok' ? 200 : 503,
  });
}
