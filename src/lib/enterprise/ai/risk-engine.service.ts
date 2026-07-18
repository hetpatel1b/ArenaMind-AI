import { AIRiskAnalysis } from './types';

export class RiskEngineService {
  /**
   * Provides directives to the LLM on how to calculate risk mathematically.
   * While the LLM generates the final numbers, this grounds the generation.
   */
  getRiskDirectives(): string {
    return `
RISK SCORING DIRECTIVE (0-100 scale):
1. Operational Risk: Impact on match schedule, broadcasting, or primary venue functions.
2. Crowd Risk: Density exceeding safe thresholds (85%+), unrest, or crush risks.
3. Security Risk: Unauthorized access, violent behavior, or threat to assets.
4. Medical Risk: Probability of injury, delayed medical response, or mass casualty.
5. Mobility Risk: Transit delays > 15 mins, egress bottlenecks, or parking gridlocks.
6. Infrastructure Risk: Power failures, structural damage, or system offline events.
7. Weather Risk: Severe conditions impacting operations or safety.
8. Overall Executive Risk: The weighted composite of the highest risk factors.
9. Category: 'nominal' (0-30), 'elevated' (31-70), 'critical' (71-100).
DO NOT UNDERESTIMATE RISK. Be highly pessimistic when life safety is involved.`;
  }

  /**
   * A programmatic fallback validator for the LLM's generated risk score.
   * If the LLM generates a category that contradicts the numerical score, we fix it.
   */
  validateRiskAnalysis(analysis: AIRiskAnalysis): AIRiskAnalysis {
    if (analysis.overallExecutiveRisk === undefined || isNaN(analysis.overallExecutiveRisk)) {
      throw new Error(
        '[RiskEngine] Insufficient evidence: overallExecutiveRisk is missing or invalid.'
      );
    }

    let correctedCategory: 'nominal' | 'elevated' | 'critical';

    if (analysis.overallExecutiveRisk > 70) correctedCategory = 'critical';
    else if (analysis.overallExecutiveRisk > 30) correctedCategory = 'elevated';
    else correctedCategory = 'nominal';

    return {
      ...analysis,
      category: correctedCategory,
    };
  }
}

export const aiRiskEngineService = new RiskEngineService();
