import { NextResponse } from 'next/server';
import { config } from '@/lib/infrastructure/config/env';

export async function GET() {
  return NextResponse.json({
    environment: config.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    buildHash: process.env.NEXT_PUBLIC_BUILD_HASH || 'dev-build',
    aiEnabled: config.ENABLE_AI_FEATURES,
  });
}
