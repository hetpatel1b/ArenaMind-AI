export interface AIProviderStats {
  successCount: number;
  failureCount: number;
  totalLatency: number;
  tokensUsed: number;
}

export type AIProvider = 'grok' | 'gemini';

export class AIProviderMonitor {
  private static providers: Record<AIProvider, AIProviderStats> = {
    grok: { successCount: 0, failureCount: 0, totalLatency: 0, tokensUsed: 0 },
    gemini: { successCount: 0, failureCount: 0, totalLatency: 0, tokensUsed: 0 },
  };

  private static fallbackCount = 0;

  static recordCall(provider: AIProvider, success: boolean, latencyMs: number, tokens = 0) {
    const stats = this.providers[provider];
    if (!stats) return; // Should not happen with Record<AIProvider>
    if (success) {
      stats.successCount++;
    } else {
      stats.failureCount++;
    }
    stats.totalLatency += latencyMs;
    stats.tokensUsed += tokens;
  }

  static recordFallback() {
    this.fallbackCount++;
  }

  static getStats() {
    const getProviderData = (name: AIProvider) => {
      const p = this.providers[name];
      if (!p) {
        return {
          availability: 'DOWN',
          latency: 0,
          successPercent: 0,
          failurePercent: 0,
          tokensUsed: 0,
          estimatedCost: 0,
        };
      }

      const total = p.successCount + p.failureCount;
      const successRate = total > 0 ? (p.successCount / total) * 100 : 100;
      const failureRate = total > 0 ? (p.failureCount / total) * 100 : 0;
      const avgLatency = total > 0 ? p.totalLatency / total : 0;
      // Mock cost calculation for demonstration
      const estimatedCost = (p.tokensUsed / 1000) * 0.002;

      return {
        availability: failureRate < 5 ? 'UP' : failureRate < 20 ? 'DEGRADED' : 'DOWN',
        latency: avgLatency,
        successPercent: successRate,
        failurePercent: failureRate,
        tokensUsed: p.tokensUsed,
        estimatedCost,
      };
    };

    return {
      primary: getProviderData('grok'),
      fallback: getProviderData('gemini'),
      fallbackFrequency: this.fallbackCount,
    };
  }
}
