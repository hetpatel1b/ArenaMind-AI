export type DecisionStrategy = 'cost-first' | 'safety-first' | 'speed-first' | 'balanced';

export class DecisionEngineService {
  /**
   * Translates the selected decision strategy into explicit AI instructions.
   */
  getStrategyDirectives(strategy: DecisionStrategy): string {
    switch (strategy) {
      case 'safety-first':
        return 'STRATEGY DIRECTIVE: Prioritize human safety and risk mitigation above all else. Ignore financial cost or slight delays if safety is compromised.';
      case 'cost-first':
        return 'STRATEGY DIRECTIVE: Optimize for minimal financial impact and resource expenditure while maintaining acceptable baseline safety.';
      case 'speed-first':
        return 'STRATEGY DIRECTIVE: Prioritize the fastest possible resolution time to minimize operational downtime. Favor immediate, decisive actions over prolonged analysis.';
      case 'balanced':
      default:
        return 'STRATEGY DIRECTIVE: Balance safety, cost, and speed. Evaluate trade-offs carefully and select the most pragmatic operational path.';
    }
  }

  /**
   * Appends incident prioritization logic to the prompt.
   */
  getPrioritizationDirectives(): string {
    return 'PRIORITIZATION RULES:\n1. Medical emergencies > Security threats > Crowd crushes > Infrastructure failures > Mobility delays.\n2. Cascading failures must be addressed at the root cause first.';
  }
}

export const aiDecisionEngineService = new DecisionEngineService();
