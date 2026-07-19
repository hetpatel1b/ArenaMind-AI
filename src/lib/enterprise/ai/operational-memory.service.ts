import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class OperationalMemoryService {
  /**
   * Retrieves past incidents and their accepted/dismissed recommendations to serve as historical precedent.
   */
  async getHistoricalContext(
    organizationId?: string,
    currentFeature?: string,
    semanticKeywords: string[] = []
  ): Promise<string> {
    const whereClause: Prisma.AiRecommendationWhereInput = {};

    // Organization-specific memory isolation
    if (organizationId) {
      whereClause.match = { organizationId };
    }
    if (currentFeature) {
      whereClause.featureName = currentFeature;
    }

    // Memory Expiration: Only consider memories from the last 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    whereClause.createdAt = { gte: ninetyDaysAgo };

    const pastRecommendations = await prisma.aiRecommendation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20, // Fetch more for ranking
      include: {
        incident: true,
      },
    });

    if (pastRecommendations.length === 0) {
      return 'HISTORICAL PRECEDENT: No highly relevant past incidents found in operational memory.';
    }

    // Rank memories
    const rankedMemories = pastRecommendations
      .map((rec) => {
        let score = 0;

        // Success/Failure weighting
        if (rec.actionTaken === 'accepted') score += 50;
        if (rec.actionTaken === 'dismissed') score -= 20; // Learn from failures

        // Time decay weighting (newer is better)
        const ageMs = Date.now() - rec.createdAt.getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        score -= ageDays * 0.5; // lose 0.5 points per day

        // Semantic Similarity (Mock: Keyword overlap against incident title/description)
        let similarityOverlap = 0;
        if (semanticKeywords.length > 0 && rec.incident) {
          const textToSearch =
            `${rec.incident.title} ${rec.incident.description || ''}`.toLowerCase();
          semanticKeywords.forEach((kw) => {
            if (textToSearch.includes(kw.toLowerCase())) {
              similarityOverlap += 10;
            }
          });
        }
        score += similarityOverlap;

        // Confidence weighting
        if (rec.confidenceScore) {
          score += Number(rec.confidenceScore) / 10;
        }

        return { rec, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Take top 3 most relevant

    let memoryStr = 'HISTORICAL PRECEDENT:\n';
    rankedMemories.forEach((item, idx) => {
      const { rec, score } = item;
      memoryStr += `Past Case ${idx + 1} (Relevance Score: ${Math.round(score)}):\n`;
      if (rec.incident) {
        memoryStr += `- Incident: ${rec.incident.title} (Severity: ${rec.incident.severityTier})\n`;
      }
      memoryStr += `- Feature: ${rec.featureName}\n`;
      if (rec.actionTaken) {
        memoryStr += `- Action Taken: ${rec.actionTaken.toUpperCase()}\n`;
      }

      // Parse the stored data structure
      try {
        const parsedData = typeof rec.data === 'string' ? JSON.parse(rec.data) : rec.data;
        if (parsedData && parsedData.recommendation) {
          memoryStr += `- Recommendation: ${parsedData.recommendation}\n`;
        }
      } catch (e) {
        // Ignore parse errors for memory
      }
      memoryStr += '\n';
    });

    return memoryStr;
  }
}

export const aiOperationalMemoryService = new OperationalMemoryService();
