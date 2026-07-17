import { NextResponse } from 'next/server';
import { HealthService } from '@/lib/platform/health/HealthService';
import { config } from '@/lib/platform/config/ConfigurationService';

export async function GET() {
  const health = await HealthService.checkHealth();

  const metrics = {
    uptime: health.uptime,
    cpu: health.metrics.cpu,
    memory: health.metrics.memory,
    // Provide placeholders for counters. In a real app, these would come from Prometheus or internal counters.
    requestCount: 0,
    activeAiRequests: 0,
    queueDepth: 0,
    providerHealth: {
      grok: health.components.aiProviders.grok.status,
      gemini: health.components.aiProviders.grok.status,
    },
  };

  return NextResponse.json(metrics, { status: 200 });
}
