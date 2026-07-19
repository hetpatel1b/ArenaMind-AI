import { StructuredAIResponse, AIResponse } from './types';
import { StructuredAIResponseSchema } from './schemas';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export class ResponseValidatorService {
  validate(response: AIResponse): StructuredAIResponse {
    try {
      // Validate using Zod
      return StructuredAIResponseSchema.parse(response.data);
    } catch (e) {
      LoggerService.error(
        'AI Response failed strict structured validation. Attempting recovery...',
        e
      );
      const dataObj =
        response.data && typeof response.data === 'object'
          ? (response.data as Record<string, SafeAny>)
          : {};
      // Fallback recovery if possible or throw
      const fallback: StructuredAIResponse = {
        observation:
          typeof dataObj.observation === 'string' ? dataObj.observation : 'Missing observation',
        evidence: [],
        reasoning: 'Fallback recovery mode engaged.',
        alternatives: [],
        riskAnalysis: {
          operationalRisk: 50,
          crowdRisk: 50,
          securityRisk: 50,
          medicalRisk: 50,
          mobilityRisk: 50,
          infrastructureRisk: 50,
          weatherRisk: 50,
          overallExecutiveRisk: 50,
          category: 'elevated',
        },
        prediction: 'Unknown',
        recommendation:
          typeof dataObj.recommendation === 'string'
            ? dataObj.recommendation
            : 'Unable to parse AI recommendation.',
        expectedOutcome: 'Unknown',
        confidence: typeof dataObj.confidence === 'number' ? dataObj.confidence : 10,
        references: [],
        missingInformation: ['Structured response failed'],
      };
      return fallback;
    }
  }
}

export const aiResponseValidator = new ResponseValidatorService();
