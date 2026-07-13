import { NextResponse } from 'next/server';
import { diagnostics } from '@/lib/infrastructure/monitoring/diagnostics';

export async function GET() {
  const report = await diagnostics.checkAll();

  return NextResponse.json(report, {
    status: report.status === 'ok' ? 200 : 503,
  });
}
