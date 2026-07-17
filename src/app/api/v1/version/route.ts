import { NextResponse } from 'next/server';
import { config } from '@/lib/platform/config/ConfigurationService';

export async function GET() {
  const versionInfo = {
    version: process.env.APP_VERSION || '0.1.0',
    buildNumber: process.env.BUILD_NUMBER || 'development',
    commitSha: process.env.COMMIT_SHA || 'unknown',
    branch: process.env.BRANCH_NAME || 'main',
    buildDate: process.env.BUILD_DATE || new Date().toISOString(),
    environment: config.nodeEnv,
  };

  return NextResponse.json(versionInfo, { status: 200 });
}
