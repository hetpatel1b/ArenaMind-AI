import { AIProviderType, AIRequest, AIResponse, AIMessage, StructuredAIResponse } from './types';
import { ProviderManager } from './provider-manager';
import { promptRegistry } from './prompt-registry.service';
import { conversationService } from './conversation.service';
import { aiSecurityService } from './security.service';
import { aiObservabilityService } from './observability.service';
import { aiCrossModuleCorrelationService } from './cross-module-correlation.service';
import { aiOperationalMemoryService } from './operational-memory.service';
import { aiExplainabilityService } from './explainability.service';
import { aiDecisionEngineService } from './decision-engine.service';
import { aiRiskEngineService } from './risk-engine.service';
import { aiRecommendationRankingService } from './recommendation-ranking.service';
import { aiScenarioSimulationService } from './scenario-simulation.service';
import { aiExecutiveSummaryService } from './executive-summary.service';
import { aiConfidenceScoringService } from './confidence-scoring.service';
import { aiAgentOrchestratorService } from './multi-agent/orchestrator.service';
import { BusinessContext } from '@/lib/services/business.context';
import { AIFeature } from '@prisma/client';

import { aiResponseCacheService } from './cache/response-cache.service';
import { aiTokenBudgetService } from './token-budget.service';
import { aiContextRankingService } from './context-ranking.service';
import { aiCostManagerService } from './cost-manager.service';
import { aiRecommendationValidatorService } from './recommendation-validator.service';
import { aiHallucinationGuardService } from './hallucination-guard.service';

export class AIGatewayService {
  async executeFeature(
    ctx: BusinessContext,
    matchId: string,
    feature: AIFeature,
    userMessage?: string,
    onProgress?: (msg: string) => void
  ): Promise<any> {
    const start = Date.now();
    try {
      if (onProgress) onProgress('Initializing AI Gateway...');

      // Phase 1: Context Pipeline
      const context = await this._buildContext(ctx, matchId, feature, onProgress);
      const systemPrompt = await this._buildPrompt(
        ctx,
        feature,
        context.rankedData,
        context.memoryData
      );

      this._validateSecurity(systemPrompt, userMessage);

      // Phase 2: Cache Check
      const cached = await this._checkCache(
        ctx,
        matchId,
        feature,
        systemPrompt,
        context.rankedData,
        start,
        onProgress
      );
      if (cached) return cached;

      // Phase 3: Memory Updates
      const conversationId = await this._updateMemory(ctx, matchId, feature, userMessage);

      // Phase 4: Execution
      if (onProgress) onProgress('Decomposing query for multi-agent swarm...');
      const rawResponse = await aiAgentOrchestratorService.orchestrate(
        userMessage || `Analyze the current state and provide ${feature}.`,
        feature,
        context.rankedData,
        onProgress
      );

      await conversationService.addMessage(
        conversationId,
        'assistant',
        JSON.stringify(rawResponse),
        0
      );

      // Phase 5: Post-Processing
      const finalData = this._postProcessResponse(rawResponse, context.rankedData);

      await aiResponseCacheService.set(
        ctx.organizationId,
        matchId,
        systemPrompt,
        context.rankedData,
        finalData
      );
      await this._logTelemetry(ctx, matchId, feature, systemPrompt, finalData, rawResponse, start);

      return finalData;
    } catch (e: unknown) {
      await this._logError(ctx, matchId, start, e);
      throw e;
    }
  }

  async chat(ctx: BusinessContext, matchId: string, message: string, history: any[]): Promise<any> {
    const contextData = await aiCrossModuleCorrelationService.getUnifiedTelemetry(ctx, matchId);
    const trimmedHistory = aiTokenBudgetService.trimHistory(history, 8000);

    const systemPrompt = `You are the ArenaMind AI Principal Operations Assistant.
Context: ${JSON.stringify(contextData)}
Answer the user's questions strictly based on this context. Be concise and precise. Identify risks and predict outcomes.`;

    const request: AIRequest = {
      systemPrompt,
      messages: [
        ...trimmedHistory.map((m) => ({ role: m.role, content: m.parts[0].text })),
        { role: 'user', content: message },
      ],
    };

    const start = Date.now();
    try {
      const result = await aiSecurityService.enforceTimeout(
        ProviderManager.execute(request),
        30000
      );

      if ('status' in result && result.status === 'error') {
        await this._logError(ctx, matchId, start, new Error(result.technicalMessage));
        return result;
      }

      const response = result as AIResponse;
      this._trackCost(ctx, response);
      await this._logChatTelemetry(ctx, matchId, response, start);

      return response.rawText;
    } catch (e: unknown) {
      await this._logError(ctx, matchId, start, e);
      return this._buildErrorResponse(e);
    }
  }

  // --- Private Pipeline Methods ---

  private async _buildContext(
    ctx: BusinessContext,
    matchId: string,
    feature: AIFeature,
    onProgress?: (msg: string) => void
  ) {
    const [rawContextData, memoryData] = await Promise.all([
      aiCrossModuleCorrelationService.getUnifiedTelemetry(ctx, matchId),
      aiOperationalMemoryService.getHistoricalContext(ctx.organizationId, feature),
      promptRegistry.getPromptSchema(feature), // Kept for schema loading side-effects if any exist
    ]);

    if (onProgress) onProgress('Analyzing contextual telemetry...');
    return { rankedData: aiContextRankingService.rankContext(rawContextData), memoryData };
  }

  private async _buildPrompt(
    ctx: BusinessContext,
    feature: AIFeature,
    contextData: any,
    memoryData: any
  ) {
    const basePrompt = await promptRegistry.getSystemPrompt(feature, {
      organizationId: ctx.organizationId,
      role: ctx.role,
    });

    let enhancedPrompt = aiExplainabilityService.enhancePrompt(basePrompt);
    enhancedPrompt += `\n\n${aiDecisionEngineService.getStrategyDirectives('balanced')}`;
    enhancedPrompt += `\n${aiDecisionEngineService.getPrioritizationDirectives()}`;
    enhancedPrompt += `\n${aiRiskEngineService.getRiskDirectives()}`;
    enhancedPrompt += `\n${aiRecommendationRankingService.getRankingDirectives()}`;
    enhancedPrompt += `\n${aiScenarioSimulationService.getSimulationDirectives()}`;
    enhancedPrompt += `\n${aiExecutiveSummaryService.getSummaryDirectives()}`;

    return `${enhancedPrompt}\n\n=== TELEMETRY DATA ===\n${JSON.stringify(contextData)}\n\n=== OPERATIONAL MEMORY ===\n${memoryData}\n====================`;
  }

  private _validateSecurity(systemPrompt: string, userMessage?: string) {
    if (
      !aiSecurityService.validatePromptSafety(systemPrompt) ||
      (userMessage && !aiSecurityService.validatePromptSafety(userMessage))
    ) {
      throw new Error('Prompt rejected due to security policy violation.');
    }
    aiHallucinationGuardService.detectPromptInjection(userMessage || '');
  }

  private async _checkCache(
    ctx: BusinessContext,
    matchId: string,
    feature: AIFeature,
    systemPrompt: string,
    contextData: any,
    start: number,
    onProgress?: (msg: string) => void
  ) {
    const cachedResponse = await aiResponseCacheService.get(
      ctx.organizationId,
      matchId,
      systemPrompt,
      contextData
    );
    if (cachedResponse) {
      if (onProgress) onProgress('Cache hit, retrieving response...');
      await aiObservabilityService.logRequest({
        organizationId: ctx.organizationId,
        matchId,
        userId: ctx.userId,
        provider: 'multi-agent-swarm' as unknown as AIProviderType,
        modelName: 'multi-agent-swarm',
        featureName: feature,
        promptVersion: 'v3.0.0-multi-agent',
        latencyMs: Date.now() - start,
        inputTokens: 0,
        outputTokens: 0,
        status: 'success',
        cacheHit: true,
      });
      return cachedResponse;
    }
    return null;
  }

  private async _updateMemory(
    ctx: BusinessContext,
    matchId: string,
    feature: AIFeature,
    userMessage?: string
  ) {
    const conversationId = await conversationService.getOrCreateConversation(
      ctx.organizationId || 'system-org',
      matchId,
      ctx.userId
    );
    await conversationService.addMessage(
      conversationId,
      'user',
      userMessage || `Analyze the current state and provide ${feature}.`
    );
    return conversationId;
  }

  private _postProcessResponse(rawResponse: any, contextData: any) {
    if (!rawResponse) return rawResponse;

    let finalData = rawResponse;
    const internalMeta = finalData._internalMetadata || {};
    delete finalData._internalMetadata;

    finalData = aiHallucinationGuardService.enforceGuardrails(finalData, contextData);

    if (finalData.confidence !== undefined && Array.isArray(finalData.missingInformation)) {
      finalData.confidence = aiConfidenceScoringService.adjustConfidence(
        finalData.confidence,
        finalData.missingInformation,
        {
          providerReliability: 95,
          agentAgreementScore: internalMeta.consensusScore,
          contextCompletenessScore: 80,
        }
      );
    }

    if (finalData.riskAnalysis) {
      finalData.riskAnalysis = aiRiskEngineService.validateRiskAnalysis(finalData.riskAnalysis);
    }

    if (Array.isArray(finalData.alternatives)) {
      finalData.alternatives = aiRecommendationValidatorService.validateRecommendations(
        finalData.alternatives,
        contextData
      );
      finalData.alternatives = aiRecommendationRankingService.rankAlternatives(
        finalData.alternatives
      );
    }

    // re-attach internal meta for logging later
    finalData._internalMetadata = internalMeta;
    return finalData;
  }

  private async _logTelemetry(
    ctx: BusinessContext,
    matchId: string,
    feature: AIFeature,
    systemPrompt: string,
    finalData: any,
    rawResponse: any,
    start: number
  ) {
    const internalMeta = finalData._internalMetadata || {};
    delete finalData._internalMetadata;

    await aiObservabilityService.logRequest({
      organizationId: ctx.organizationId,
      matchId,
      userId: ctx.userId,
      provider: 'multi-agent-swarm' as unknown as AIProviderType,
      modelName: 'multi-agent-swarm',
      featureName: feature,
      promptVersion: 'v3.0.0-multi-agent',
      latencyMs: Date.now() - start,
      inputTokens: aiTokenBudgetService.estimateTokens(systemPrompt),
      outputTokens: aiTokenBudgetService.estimateTokens(JSON.stringify(finalData)),
      status: 'success',
      cacheHit: false,
      agentCount: internalMeta.agentCount,
      consensusScore: internalMeta.consensusScore,
      hallucinationDetected: finalData?.confidence === 0,
      confidenceAdjustment:
        finalData?.confidence !== undefined
          ? finalData.confidence - (rawResponse?.confidence || 0)
          : 0,
    });
  }

  private async _logError(ctx: BusinessContext, matchId: string, start: number, e: unknown) {
    await aiObservabilityService.logRequest({
      organizationId: ctx.organizationId,
      matchId,
      userId: ctx.userId,
      provider: 'grok', // or multi-agent-swarm based on context
      modelName: 'failover',
      latencyMs: Date.now() - start,
      inputTokens: 0,
      outputTokens: 0,
      status: 'error',
      errorMessage: e instanceof Error ? e.message : String(e),
    });
  }

  private _trackCost(ctx: BusinessContext, response: AIResponse) {
    aiCostManagerService.trackExecution(ctx, {
      promptTokens: response.metadata.promptTokens,
      completionTokens: response.metadata.outputTokens,
      provider: response.metadata.provider,
      latencyMs: response.metadata.latencyMs,
      cacheHit: false,
    });
  }

  private async _logChatTelemetry(
    ctx: BusinessContext,
    matchId: string,
    response: AIResponse,
    start: number
  ) {
    await aiObservabilityService.logRequest({
      organizationId: ctx.organizationId,
      matchId,
      userId: ctx.userId,
      provider: response.metadata.provider,
      modelName: response.metadata.model,
      latencyMs: response.metadata.latencyMs,
      inputTokens: response.metadata.promptTokens,
      outputTokens: response.metadata.outputTokens,
      status: 'success',
      cacheHit: false,
    });
  }

  private _buildErrorResponse(e: unknown) {
    return {
      status: 'error',
      metadata: { traceId: crypto.randomUUID() },
      providerAttempted: 'grok',
      providerFailed: 'all',
      retryCount: 0,
      operatorMessage: 'The AI service is temporarily unavailable.',
      technicalMessage: e instanceof Error ? e.message : String(e),
      recommendedAction: 'Check gateway connectivity.',
    };
  }
}

export const aiGatewayService = new AIGatewayService();
