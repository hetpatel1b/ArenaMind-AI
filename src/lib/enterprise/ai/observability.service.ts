import { prisma } from '@/lib/db/client';

export class ObservabilityService {
  async logRequest(params: {
    organizationId?: string;
    matchId?: string;
    userId?: string;
    provider: string;
    modelName: string;
    promptVersion?: string;
    featureName?: string;
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
    status: 'success' | 'error' | 'timeout' | 'blocked';
    errorMessage?: string;
    retries?: number;
    fallbackUsed?: boolean;
    cacheHit?: boolean;
    agentCount?: number;
    consensusScore?: number;
    hallucinationDetected?: boolean;
    confidenceAdjustment?: number;
  }) {
    try {
      // Calculate a rough estimated cost
      // e.g. Gemini 2.0 Flash: $0.10 / 1M input tokens, $0.40 / 1M output tokens
      const estimatedCost =
        (params.inputTokens / 1_000_000) * 0.1 + (params.outputTokens / 1_000_000) * 0.4;

      const validMatchId = params.matchId === 'system-default-match' ? undefined : params.matchId;
      await prisma.aiGatewayLog.create({
        data: {
          organizationId: params.organizationId,
          matchId: validMatchId,
          userId: params.userId,
          provider: params.provider,
          modelName: params.modelName,
          promptVersion: params.promptVersion,
          featureName: params.featureName,
          latencyMs: params.latencyMs,
          inputTokens: params.inputTokens,
          outputTokens: params.outputTokens,
          estimatedCost,
          status: params.status,
          errorMessage: params.errorMessage,
          retries: params.retries || 0,
          fallbackUsed: params.fallbackUsed || false,
          cacheHit: params.cacheHit || false,
          agentCount: params.agentCount,
          consensusScore: params.consensusScore,
          hallucinationDetected: params.hallucinationDetected || false,
          confidenceAdjustment: params.confidenceAdjustment,
        },
      });
    } catch (e) {
      console.error('Failed to log AI Request:', e);
    }
  }
}

export const aiObservabilityService = new ObservabilityService();
