import { AIAlternative } from './types';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export class RecommendationValidatorService {
  validateRecommendations(alternatives: AIAlternative[], contextData: SafeAny): AIAlternative[] {
    if (!alternatives || !Array.isArray(alternatives)) return [];

    return alternatives.filter((alt) => {
      // Reject if confidence is too low
      if (alt.confidence < 20) return false;

      // Ensure basic structure exists
      if (!alt.action || !alt.strategy) return false;

      const actionLower = alt.action.toLowerCase();

      // Simulate Policy/Rules Engine Check
      // E.g. Cannot deploy helicopters if weather is severe
      if (actionLower.includes('helicopter') || actionLower.includes('drone')) {
        const hasSevereWeather = JSON.stringify(contextData)
          .toLowerCase()
          .includes('severe weather');
        if (hasSevereWeather) {
          LoggerService.warn(
            `[Validator] Rejected recommendation "${alt.action}" due to severe weather constraints.`
          );
          return false;
        }
      }

      // E.g. Cannot deploy SWAT without critical incident
      if (actionLower.includes('swat') || actionLower.includes('tactical team')) {
        const isCritical = JSON.stringify(contextData).toLowerCase().includes('critical incident');
        if (!isCritical) {
          LoggerService.warn(
            `[Validator] Rejected recommendation "${alt.action}" due to lack of critical incident severity.`
          );
          return false;
        }
      }

      return true;
    });
  }
}

export const aiRecommendationValidatorService = new RecommendationValidatorService();
