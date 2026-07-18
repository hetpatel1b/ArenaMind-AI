import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { aiGatewayService } from '@/lib/enterprise/ai/gateway.service';
import { aiRecommendationRepository, aiFeedbackRepository } from './repository';
import { AIFeature, ActionTaken } from '@prisma/client';

export class AiService extends BaseService {
  constructor() {
    super('AiService');
  }

  async generateRecommendation(ctx: BusinessContext, matchId: string, feature: AIFeature) {
    return this.execute('generateRecommendation', ctx, async () => {
      // 1. Delegate to the new Enterprise AI Gateway
      const data = await aiGatewayService.executeFeature(ctx, matchId, feature);

      // Extract confidence from output safely
      let confidenceScore = 100;
      if (Array.isArray(data) && data.length > 0 && typeof data[0].confidence === 'number') {
        confidenceScore = data[0].confidence;
      } else if (data && typeof data.confidence === 'number') {
        confidenceScore = data.confidence;
      }

      // 2. Save to Repository
      const recommendation = await aiRecommendationRepository.create({
        match: { connect: { id: matchId } },
        venue: { connect: { id: ctx.venueId } },
        featureName: feature,
        modelName: 'gemini-2.0-flash', // Now logged centrally, but kept here for backward compatibility
        promptVersion: 'v1.0',
        data: data,
        confidenceScore,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours expiry
      });

      return recommendation;
    });
  }

  async getLatestRecommendations(ctx: BusinessContext, matchId: string, feature?: AIFeature) {
    return this.execute('getLatestRecommendations', ctx, async () => {
      const filter: any = { matchId, venueId: ctx.venueId };
      if (feature) filter.featureName = feature;

      const { data } = await aiRecommendationRepository.findAll({
        filter,
        sort: [{ field: 'createdAt', order: 'desc' }],
        pagination: { page: 1, limit: 10 },
      });
      return data;
    });
  }

  async recordFeedback(
    ctx: BusinessContext,
    recommendationId: string,
    actionTaken: ActionTaken,
    rating?: number,
    reason?: string
  ) {
    return this.execute('recordFeedback', ctx, async () => {
      // 1. Update the recommendation status
      const recommendation = await aiRecommendationRepository.update(recommendationId, {
        actionTaken,
        actedByUser: ctx.userId ? { connect: { id: ctx.userId } } : undefined,
        actedAt: new Date(),
        dismissReason: reason,
        feedbackRating: rating,
      });

      // 2. Record Feedback entry
      if (ctx.userId) {
        await aiFeedbackRepository.create({
          aiRecommendation: { connect: { id: recommendationId } },
          user: { connect: { id: ctx.userId } },
        });
      }

      return recommendation;
    });
  }
}

export const aiService = new AiService();
