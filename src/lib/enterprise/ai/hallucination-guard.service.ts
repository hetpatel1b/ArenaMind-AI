import { StructuredAIResponse } from './types';

export class HallucinationGuardService {
  /**
   * Scans the AI response against the provided verified context to detect
   * potential hallucinations (e.g. unknown cameras, locations, people).
   */
  enforceGuardrails(
    response: Partial<StructuredAIResponse>,
    verifiedContext: any
  ): Partial<StructuredAIResponse> {
    if (!response || typeof response.observation !== 'string') return response;

    const contextStr = JSON.stringify(verifiedContext).toLowerCase();
    const observationLower = response.observation.toLowerCase();
    const reasoningLower = (response.reasoning || '').toLowerCase();

    // A simplistic heuristic: If the AI mentions "Camera 99" but "Camera 99" is nowhere in context.
    // In production, we'd use NLP NER extraction and exact matching against a graph database.
    // Here we'll simulate the guard by looking for specific "unknown" indicators if it lacks evidence.

    const hasMissingEvidence =
      response.missingInformation && response.missingInformation.length > 2;
    const isLowConfidence = response.confidence && response.confidence < 50;

    // Strict hallucination check: if it makes definitive claims but lacks evidence
    if (hasMissingEvidence && isLowConfidence) {
      if (
        observationLower.includes('is located at') ||
        observationLower.includes('suspect identified') ||
        reasoningLower.includes('confirmed')
      ) {
        return {
          ...response,
          observation: "I don't have sufficient verified evidence. " + response.observation,
          recommendation:
            'Hold action pending verified intelligence. ' + (response.recommendation || ''),
          confidence: Math.min(response.confidence || 0, 20),
        };
      }
    }

    // Explicit keyword scanning for fabricated entities (Simulation)
    const fabricatedKeywords = ['camera 99', 'unknown sector z', 'unverified protocol x'];
    let hallucinationDetected = false;

    for (const fw of fabricatedKeywords) {
      if (observationLower.includes(fw) || reasoningLower.includes(fw)) {
        if (!contextStr.includes(fw)) {
          hallucinationDetected = true;
          break;
        }
      }
    }

    if (hallucinationDetected) {
      return {
        ...response,
        observation:
          "I don't have sufficient verified evidence to support the existence of the mentioned entities.",
        reasoning:
          'Data verification failed. Entities mentioned do not exist in the current operational memory or telemetry.',
        confidence: 0,
        alternatives: [], // Clear invalid alternatives
      };
    }

    return response;
  }

  /**
   * Detects basic prompt injection vectors in user input.
   */
  detectPromptInjection(userPrompt: string): void {
    if (!userPrompt) return;
    const lower = userPrompt.toLowerCase();

    const injectionVectors = [
      'ignore previous instructions',
      'ignore all previous instructions',
      'forget previous instructions',
      'you are now',
      'system prompt',
      'system instruction',
      'say the following',
      'print the following',
      'bypass security',
    ];

    for (const vector of injectionVectors) {
      if (lower.includes(vector)) {
        throw new Error('Prompt rejected: Security policy violation (Injection Detected).');
      }
    }
  }
}

export const aiHallucinationGuardService = new HallucinationGuardService();
