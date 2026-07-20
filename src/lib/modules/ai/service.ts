import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { aiGatewayService } from '@/lib/enterprise/ai/gateway.service';
import { aiRecommendationRepository, aiFeedbackRepository } from './repository';
import { AIFeature, ActionTaken, Prisma } from '@prisma/client';
import { isUUID } from '@/lib/validation/uuid';
import { prisma } from '@/lib/db/client';

export class AiService extends BaseService {
  constructor() {
    super('AiService');
  }

  async generateRecommendation(ctx: BusinessContext, matchId: string, feature: AIFeature) {
    return this.execute('generateRecommendation', ctx, async () => {
      // 1. Delegate to the new Enterprise AI Gateway
      const data = await aiGatewayService.executeFeature(ctx, matchId, feature);

      const dataArray = Array.isArray(data) ? (data as Array<Record<string, SafeAny>>) : null;
      const dataObj =
        data && typeof data === 'object' && !Array.isArray(data)
          ? (data as Record<string, SafeAny>)
          : null;

      // Extract confidence from output safely
      let confidenceScore = 100;
      if (dataArray && dataArray.length > 0) {
        const first = dataArray[0];
        if (first && typeof first.confidence === 'number') {
          confidenceScore = first.confidence;
        }
      } else if (dataObj && typeof dataObj.confidence === 'number') {
        confidenceScore = dataObj.confidence;
      }

      // 2. Resolve valid Match UUID & Venue UUID for relation connection
      let validMatchId = isUUID(matchId) ? matchId : undefined;
      if (!validMatchId) {
        try {
          const activeMatch = await prisma.match.findFirst({ select: { id: true } });
          if (activeMatch) validMatchId = activeMatch.id;
        } catch (e) {
          // ignore DB error
        }
      }

      if (!validMatchId) {
        return { id: crypto.randomUUID(), data, confidenceScore };
      }

      const validVenueId = isUUID(ctx.venueId) ? ctx.venueId : undefined;

      const recommendation = await aiRecommendationRepository.create({
        match: { connect: { id: validMatchId } },
        ...(validVenueId ? { venue: { connect: { id: validVenueId } } } : {}),
        featureName: feature,
        modelName: 'gemini-2.0-flash', // Logged centrally
        promptVersion: 'v1.0',
        data: data as Prisma.InputJsonValue,
        confidenceScore,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours expiry
      });

      return recommendation;
    });
  }

  async getLatestRecommendations(ctx: BusinessContext, matchId: string, feature?: AIFeature) {
    return this.execute('getLatestRecommendations', ctx, async () => {
      const filter: Record<string, SafeAny> = { matchId, venueId: ctx.venueId };
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
