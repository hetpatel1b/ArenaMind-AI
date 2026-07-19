import { prisma } from '@/lib/db/client';

export class AiMetricsService {
  public async getGovernanceDashboardMetrics(organizationId: string, timeWindowMs = 86400000) {
    const since = new Date(Date.now() - timeWindowMs);

    const logs = await prisma.aiGatewayLog.findMany({
      where: {
        organizationId,
        createdAt: { gte: since },
      },
      select: {
        latencyMs: true,
        provider: true,
        cacheHit: true,
        fallbackUsed: true,
        estimatedCost: true,
        hallucinationDetected: true,
        consensusScore: true,
        confidenceAdjustment: true,
      },
    });

    const totalRequests = logs.length || 1; // Prevent division by zero

    let totalLatency = 0;
    let cacheHits = 0;
    let fallbacks = 0;
    let totalCost = 0;
    let hallucinations = 0;
    let totalConsensusScore = 0;
    let consensusCount = 0;

    const providerUsage: Record<string, number> = {};

    logs.forEach((log) => {
      totalLatency += log.latencyMs;
      if (log.cacheHit) cacheHits++;
      if (log.fallbackUsed) fallbacks++;
      if (log.estimatedCost) totalCost += Number(log.estimatedCost);
      if (log.hallucinationDetected) hallucinations++;
      if (log.consensusScore !== null) {
        totalConsensusScore += log.consensusScore;
        consensusCount++;
      }

      providerUsage[log.provider] = (providerUsage[log.provider] || 0) + 1;
    });

    return {
      averageLatencyMs: Math.round(totalLatency / totalRequests),
      providerUsage,
      cacheHitRatio: (cacheHits / totalRequests) * 100,
      fallbackPercentage: (fallbacks / totalRequests) * 100,
      averageCost: Number((totalCost / totalRequests).toFixed(6)),
      totalEstimatedCost: Number(totalCost.toFixed(4)),
      hallucinationRate: (hallucinations / totalRequests) * 100,
      averageConsensusScore:
        consensusCount > 0 ? Math.round(totalConsensusScore / consensusCount) : 100,
    };
  }
}

export const aiMetricsService = new AiMetricsService();
