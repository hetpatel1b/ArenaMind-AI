import { AIProviderType } from './types';
import { aiProviderHealthService } from './provider-health.service';

export interface RoutingDecision {
  provider: AIProviderType;
  model: string;
  reason: string;
}

export class ModelRoutingService {
  public route(
    promptTokens: number,
    complexityScore: number, // 1 to 10
    budgetLimit: number,
    latencyRequirement: 'low' | 'flexible',
    orgPolicy:
      'cost-optimized' | 'performance-optimized' | 'accuracy-optimized' = 'performance-optimized'
  ): RoutingDecision {
    let targetProvider: AIProviderType = 'grok';
    let targetModel = 'grok-fast';
    let reason = 'Default routing';

    // 1. Evaluate Complexity
    if (complexityScore > 7 || orgPolicy === 'accuracy-optimized') {
      targetModel = 'grok-large';
      reason = 'High complexity or accuracy required.';
    }

    // 2. Evaluate Latency
    if (latencyRequirement === 'low') {
      targetModel = 'grok-fast';
      reason = 'Strict low latency requirement.';
    }

    // 3. Provider Health Check (Failover)
    if (!aiProviderHealthService.isHealthy('grok')) {
      targetProvider = 'gemini';
      targetModel = 'gemini-2.5-pro'; // Assuming Gemini as primary fallback
      reason = 'Primary provider (Grok) is unhealthy. Failing over to Gemini.';
    } else if (
      targetProvider === 'grok' &&
      targetModel === 'grok-large' &&
      budgetLimit < 0.05 &&
      orgPolicy === 'cost-optimized'
    ) {
      // Cost limit optimization
      targetModel = 'grok-fast';
      reason = 'Downgraded to fast model to meet cost budget.';
    }

    return {
      provider: targetProvider,
      model: targetModel,
      reason,
    };
  }
}

export const aiModelRoutingService = new ModelRoutingService();
