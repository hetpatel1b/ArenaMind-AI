import { AgentOutput } from './conflict-resolution.service';

export interface ConsensusResult {
  consensusScore: number;
  conflictScore: number;
  dominantRecommendation: string;
  agentVotes: Record<string, 'Agree' | 'Neutral' | 'Disagree'>;
}

export class ConsensusEngineService {
  /**
   * Programmatically calculates consensus among domain agents.
   * This is a heuristic approach that compares recommendations for similarity
   * and weighs them by confidence to produce a consensus score.
   */
  calculateConsensus(agentOutputs: AgentOutput[]): ConsensusResult {
    if (!agentOutputs || agentOutputs.length === 0) {
      return {
        consensusScore: 0,
        conflictScore: 0,
        dominantRecommendation: 'No recommendations provided.',
        agentVotes: {},
      };
    }

    if (agentOutputs.length === 1) {
      const output = agentOutputs[0]!;
      return {
        consensusScore: 100,
        conflictScore: 0,
        dominantRecommendation: output.recommendation,
        agentVotes: { [output.agentId]: 'Agree' },
      };
    }

    // Group recommendations by similarity (heuristic based on shared keywords)
    // In a full implementation, we might use embeddings. Here we use keyword overlap.
    const groups: { recommendation: string; totalConfidence: number; agentIds: string[] }[] = [];

    agentOutputs.forEach((output) => {
      const recTokens = new Set(
        output.recommendation
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 3)
      );

      let bestMatch = null;
      let maxOverlap = 0;

      for (const group of groups) {
        const groupTokens = new Set(
          group.recommendation
            .toLowerCase()
            .split(/\W+/)
            .filter((w) => w.length > 3)
        );
        const intersection = new Set([...recTokens].filter((x) => groupTokens.has(x)));
        const overlap = intersection.size / Math.max(recTokens.size, groupTokens.size);

        if (overlap > 0.4 && overlap > maxOverlap) {
          maxOverlap = overlap;
          bestMatch = group;
        }
      }

      if (bestMatch) {
        bestMatch.totalConfidence += output.confidence;
        bestMatch.agentIds.push(output.agentId);
        // Combine recommendations text slightly if we wanted, but keeping the dominant one is fine
        if (output.confidence > bestMatch.totalConfidence / bestMatch.agentIds.length) {
          bestMatch.recommendation = output.recommendation;
        }
      } else {
        groups.push({
          recommendation: output.recommendation,
          totalConfidence: output.confidence,
          agentIds: [output.agentId],
        });
      }
    });

    groups.sort((a, b) => b.totalConfidence - a.totalConfidence);
    const dominantGroup = groups[0];

    if (!dominantGroup) {
      return {
        consensusScore: 0,
        conflictScore: 0,
        dominantRecommendation: 'No recommendations generated.',
        agentVotes: {},
      };
    }

    // Assign votes
    const agentVotes: Record<string, 'Agree' | 'Neutral' | 'Disagree'> = {};
    let totalConfidenceAll = 0;
    let conflictWeight = 0;

    agentOutputs.forEach((output) => {
      totalConfidenceAll += output.confidence;
      if (dominantGroup.agentIds.includes(output.agentId)) {
        agentVotes[output.agentId] = 'Agree';
      } else {
        // If they have distinct differing recommendations with high confidence, it's a conflict
        if (output.confidence > 70) {
          agentVotes[output.agentId] = 'Disagree';
          conflictWeight += output.confidence;
        } else {
          agentVotes[output.agentId] = 'Neutral';
          conflictWeight += output.confidence * 0.5;
        }
      }
    });

    const consensusScore = Math.min(
      100,
      Math.round((dominantGroup.totalConfidence / totalConfidenceAll) * 100)
    );
    const conflictScore = Math.min(100, Math.round((conflictWeight / totalConfidenceAll) * 100));

    return {
      consensusScore,
      conflictScore,
      dominantRecommendation: dominantGroup.recommendation,
      agentVotes,
    };
  }
}

export const aiConsensusEngineService = new ConsensusEngineService();
