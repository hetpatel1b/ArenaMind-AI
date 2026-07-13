import { NextResponse } from 'next/server';
import { runtimeMonitor } from '@/lib/infrastructure/ops/runtime-monitor';

export async function GET() {
  return NextResponse.json(runtimeMonitor.getSnapshot());
}
