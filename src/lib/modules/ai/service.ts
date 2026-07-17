import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { aiContextBuilder } from './context-builder';
import { promptOrchestrator } from './prompt-orchestrator';
import {
  aiRecommendationRepository,
  aiCallLogRepository,
  aiFeedbackRepository,
} from './repository';
import { geminiModel } from '@/lib/ai/gemini';
import { AIFeature, ActionTaken } from '@prisma/client';

export class AiService extends BaseService {
  constructor() {
    super('AiService');
  }

  async generateRecommendation(ctx: BusinessContext, matchId: string, feature: AIFeature) {
    return this.execute('generateRecommendation', ctx, async () => {
      const startTime = Date.now();
      let success = false;
      let promptTokens = 0;
      let outputTokens = 0;

      try {
        // 1. Build Context
        const contextData = await aiContextBuilder.buildMatchContext(ctx, matchId);

        // 2. Orchestrate Prompts
        const systemPrompt = promptOrchestrator.getSystemPrompt(feature);
        const userPrompt = promptOrchestrator.buildUserPrompt(contextData);
        const schemaDef = promptOrchestrator.getSchema(feature);

        // 3. Call Gemini
        const chatSession = geminiModel.startChat({
          systemInstruction: systemPrompt,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schemaDef.geminiSchema,
          },
        });

        const result = await chatSession.sendMessage(userPrompt);
        const responseText = result.response.text();
        const usageMetadata = result.response.usageMetadata;

        promptTokens = usageMetadata?.promptTokenCount || 0;
        outputTokens = usageMetadata?.candidatesTokenCount || 0;

        // Parse JSON
        const sanitizedText = responseText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        const rawData = JSON.parse(sanitizedText);

        // Strict Zod Validation (LLM02 Fix)
        const data = schemaDef.zodSchema.parse(rawData);

        success = true;

        // Extract confidence from output safely
        let confidenceScore = 100;
        if (Array.isArray(data) && data.length > 0 && typeof data[0].confidence === 'number') {
          confidenceScore = data[0].confidence;
        } else if (data && typeof (data as any).confidence === 'number') {
          confidenceScore = (data as any).confidence;
        }

        // 4. Save to Repository
        const recommendation = await aiRecommendationRepository.create({
          match: { connect: { id: matchId } },
          venue: { connect: { id: ctx.venueId } },
          featureName: feature,
          modelName: 'gemini-2.0-flash',
          promptVersion: 'v1.0',
          data: data as any,
          confidenceScore,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours expiry
        });

        // 5. Log call
        await aiCallLogRepository.create({
          match: { connect: { id: matchId } },
          featureName: feature,
          modelName: 'gemini-2.0-flash',
          promptVersion: 'v1.0',
          success: true,
          latencyMs: Date.now() - startTime,
          promptTokens,
          outputTokens,
        });

        return recommendation;
      } catch (error) {
        // Log failure
        await aiCallLogRepository.create({
          match: { connect: { id: matchId } },
          featureName: feature,
          modelName: 'gemini-2.0-flash',
          promptVersion: 'v1.0',
          success: false,
          latencyMs: Date.now() - startTime,
        });
        throw error;
      }
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
