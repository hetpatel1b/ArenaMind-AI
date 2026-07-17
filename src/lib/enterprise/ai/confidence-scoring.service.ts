export class ConfidenceScoringService {
  /**
   * Programmatically calibrates confidence based on multiple intelligence vectors.
   */
  adjustConfidence(
    baseConfidence: number,
    missingInformation: string[],
    options?: {
      agentAgreementScore?: number; // 0-100
      contextCompletenessScore?: number; // 0-100
      historicalSimilarityScore?: number; // 0-100
      providerReliability?: number; // 0-100
    }
  ): number {
    let finalConfidence = baseConfidence;

    // 1. Missing Evidence Penalty
    if (missingInformation && missingInformation.length > 0) {
      finalConfidence -= missingInformation.length * 10;
    }

    if (options) {
      // 2. Agent Consensus Impact (Strongest weight)
      if (options.agentAgreementScore !== undefined) {
        const consensusDiff = (options.agentAgreementScore - 50) / 2; // e.g. 100 agreement adds 25 points, 0 agreement drops 25 points
        finalConfidence += consensusDiff;
      }

      // 3. Context Completeness
      if (options.contextCompletenessScore !== undefined) {
        if (options.contextCompletenessScore < 50) {
          finalConfidence -= 15;
        } else if (options.contextCompletenessScore > 90) {
          finalConfidence += 10;
        }
      }

      // 4. Historical Similarity
      if (
        options.historicalSimilarityScore !== undefined &&
        options.historicalSimilarityScore > 80
      ) {
        finalConfidence += 10; // Proven pattern
      }

      // 5. Provider Reliability
      if (options.providerReliability !== undefined && options.providerReliability < 90) {
        finalConfidence -= 5;
      }
    }

    // Floor at 0, Ceiling at 100
    return Math.max(0, Math.min(100, Math.round(finalConfidence)));
  }
}

export const aiConfidenceScoringService = new ConfidenceScoringService();
