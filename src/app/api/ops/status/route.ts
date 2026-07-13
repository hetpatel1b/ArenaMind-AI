import { NextResponse } from 'next/server';
import { diagnostics } from '@/lib/infrastructure/monitoring/diagnostics';
import { maintenanceManager } from '@/lib/infrastructure/ops/maintenance';

export async function GET() {
  if (maintenanceManager.isActive()) {
    return NextResponse.json(
      {
        status: 'maintenance',
        reason: maintenanceManager.getReason(),
      },
      { status: 503 }
    );
  }

  const report = await diagnostics.checkAll();
  return NextResponse.json(report, {
    status: report.status === 'ok' ? 200 : 503,
  });
}
