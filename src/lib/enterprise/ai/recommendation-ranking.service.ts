import { AIAlternative } from './types';

export class RecommendationRankingService {
  /**
   * Instructs the LLM to provide highly ranked recommendations based on cost, impact, and resources.
   */
  getRankingDirectives(): string {
    return `
RANKING DIRECTIVE:
Generate multiple (at least 2) alternatives for your recommendation.
You MUST rank them internally before selecting your primary recommendation.
Consider:
1. Impact (Does it solve the core issue?)
2. Cost (Does it require excessive financial/resource expenditure?)
3. Resource Availability (Can we actually deploy this now?)
4. Recovery Time (How quickly will operations return to normal?)
Your primary recommendation MUST be the highest-scoring alternative across these dimensions.`;
  }

  /**
   * Post-processes the LLM's alternatives to programmatically ensure the highest confidence
   * or lowest risk option is flagged (if the LLM made a mistake in selection).
   * Note: In a fully autonomous system, this would actually swap the primary recommendation.
   * For now, we just ensure alternatives are sorted by confidence descending.
   */
  rankAlternatives(alternatives: AIAlternative[]): AIAlternative[] {
    if (!alternatives || alternatives.length === 0) return [];

    // Sort by confidence (highest first)
    return [...alternatives].sort((a, b) => b.confidence - a.confidence);
  }
}

export const aiRecommendationRankingService = new RecommendationRankingService();
