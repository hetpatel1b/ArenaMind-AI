import { StructuredAIResponse, AIResponse } from './types';
import { StructuredAIResponseSchema } from './schemas';

export class ResponseValidatorService {
  validate(response: AIResponse): StructuredAIResponse {
    try {
      // Validate using Zod
      return StructuredAIResponseSchema.parse(response.data);
    } catch (e) {
      console.warn('AI Response failed strict structured validation. Attempting recovery...', e);
      // Fallback recovery if possible or throw
      const fallback: StructuredAIResponse = {
        observation:
          typeof response.data?.observation === 'string'
            ? response.data.observation
            : 'Missing observation',
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
          typeof response.data?.recommendation === 'string'
            ? response.data.recommendation
            : 'Unable to parse AI recommendation.',
        expectedOutcome: 'Unknown',
        confidence: typeof response.data?.confidence === 'number' ? response.data.confidence : 10,
        references: [],
        missingInformation: ['Structured response failed'],
      };
      return fallback;
    }
  }
}

export const aiResponseValidator = new ResponseValidatorService();
