import { AIProviderType } from './types';
import { aiObservabilityService } from './observability.service';

export interface CostMetrics {
  promptTokens: number;
  completionTokens: number;
  estimatedCost: number;
  provider: AIProviderType;
  latencyMs: number;
  cacheHit: boolean;
}

export class CostManagerService {
  // Approximate pricing per 1M tokens
  private readonly PRICING = {
    grok: { prompt: 5.0, completion: 15.0 }, // Grok-2 pricing estimate
    gemini: { prompt: 0.075, completion: 0.3 }, // Gemini 2.0 Flash pricing estimate
  };

  estimateCost(provider: AIProviderType, promptTokens: number, completionTokens: number): number {
    const rates = this.PRICING[provider as keyof typeof this.PRICING] || this.PRICING.gemini;
    const promptCost = (promptTokens / 1_000_000) * rates.prompt;
    const completionCost = (completionTokens / 1_000_000) * rates.completion;
    return promptCost + completionCost;
  }

  trackExecution(
    ctx: { organizationId?: string; userId?: string; matchId?: string },
    metrics: Omit<CostMetrics, 'estimatedCost'>
  ): void {
    const estimatedCost = this.estimateCost(
      metrics.provider,
      metrics.promptTokens,
      metrics.completionTokens
    );

    // In a real database, this would insert into AiGatewayLog via Prisma.
    // We defer to observabilityService for actual logging but log cost metrics here.
    // eslint-disable-next-line no-console
    console.debug(
      `[CostManager] Execution cost estimated at $${estimatedCost.toFixed(6)} for ${metrics.provider}. Cache Hit: ${metrics.cacheHit}`
    );
  }
}

export const aiCostManagerService = new CostManagerService();
