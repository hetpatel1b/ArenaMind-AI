import { AIProviderType, AIRequest, AIResponse, AIMessage, StructuredAIResponse } from './types';
import { ProviderManager } from './provider-manager';
import { promptRegistry } from './prompt-registry.service';
import { conversationService } from './conversation.service';
import { aiSecurityService } from './security.service';
import { aiObservabilityService } from './observability.service';
import { aiResponseValidator } from './response-validator.service';
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
    const modelName = 'multi-agent-swarm';
    const start = Date.now();

    if (onProgress) onProgress('Initializing AI Gateway...');

    // 1. Parallelize Context Retrieval
    const [rawContextData, memoryData, schemaConfig] = await Promise.all([
      aiCrossModuleCorrelationService.getUnifiedTelemetry(ctx, matchId),
      aiOperationalMemoryService.getHistoricalContext(ctx.organizationId, feature),
      promptRegistry.getPromptSchema(feature),
    ]);

    if (onProgress) onProgress('Analyzing contextual telemetry...');

    // 2. Context Ranking
    const contextData = aiContextRankingService.rankContext(rawContextData);

    // 3. Prompt Intelligence Orchestration
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

    const systemPrompt = `${enhancedPrompt}\n\n=== TELEMETRY DATA ===\n${JSON.stringify(contextData)}\n\n=== OPERATIONAL MEMORY ===\n${memoryData}\n====================`;

    if (
      !aiSecurityService.validatePromptSafety(systemPrompt) ||
      (userMessage && !aiSecurityService.validatePromptSafety(userMessage as string))
    ) {
      throw new Error('Prompt rejected due to security policy violation.');
    }

    // Prompt injection guard check could also go here
    aiHallucinationGuardService.detectPromptInjection(userMessage || '');

    // 4. Cache Check
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

    // 5. Conversation Memory (Parallelizable with Cache Check if needed, but placed here to avoid DB calls on cache hit)
    const conversationId = await conversationService.getOrCreateConversation(
      ctx.organizationId || 'system-org',
      matchId,
      ctx.userId
    );

    if (userMessage) {
      await conversationService.addMessage(conversationId, 'user', userMessage);
    } else {
      await conversationService.addMessage(
        conversationId,
        'user',
        `Analyze the current state and provide ${feature}.`
      );
    }

    try {
      if (onProgress) onProgress('Decomposing query for multi-agent swarm...');
      // 6. Multi-Agent Orchestration
      const orchestratorResponse = await aiAgentOrchestratorService.orchestrate(
        userMessage || `Analyze the current state and provide ${feature}.`,
        feature,
        contextData,
        onProgress
      );

      await conversationService.addMessage(
        conversationId,
        'assistant',
        JSON.stringify(orchestratorResponse),
        0
      );

      // 7. Pipeline Post-Processing
      let finalData = orchestratorResponse;
      let internalMeta: any = {};

      if (finalData) {
        // Extract internal backend metadata
        if ((finalData as any)._internalMetadata) {
          internalMeta = (finalData as any)._internalMetadata;
          delete (finalData as any)._internalMetadata;
        }

        // Hallucination Guard
        finalData = aiHallucinationGuardService.enforceGuardrails(finalData, contextData);

        // Confidence Calibration
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

        // Risk Validation
        if (finalData.riskAnalysis) {
          finalData.riskAnalysis = aiRiskEngineService.validateRiskAnalysis(finalData.riskAnalysis);
        }

        // Recommendation Validation & Ranking
        if (Array.isArray(finalData.alternatives)) {
          finalData.alternatives = aiRecommendationValidatorService.validateRecommendations(
            finalData.alternatives,
            contextData
          );
          finalData.alternatives = aiRecommendationRankingService.rankAlternatives(
            finalData.alternatives
          );
        }
      }

      // 8. Cache the result if valid
      await aiResponseCacheService.set(
        ctx.organizationId,
        matchId,
        systemPrompt,
        contextData,
        finalData
      );

      // 9. Observability logging
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
            ? finalData.confidence - (orchestratorResponse?.confidence || 0)
            : 0,
      });

      return finalData;
    } catch (e: unknown) {
      await aiObservabilityService.logRequest({
        organizationId: ctx.organizationId,
        matchId,
        provider: 'multi-agent-swarm' as unknown as AIProviderType,
        modelName: 'multi-agent-swarm',
        latencyMs: Date.now() - start,
        inputTokens: 0,
        outputTokens: 0,
        status: 'error',
        errorMessage: e instanceof Error ? e.message : String(e),
      });
      throw e;
    }
  }

  async chat(ctx: BusinessContext, matchId: string, message: string, history: any[]): Promise<any> {
    const contextData = await aiCrossModuleCorrelationService.getUnifiedTelemetry(ctx, matchId);

    // Trim history based on budget
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
        await aiObservabilityService.logRequest({
          organizationId: ctx.organizationId,
          matchId,
          userId: ctx.userId,
          provider: 'grok',
          modelName: 'failover',
          latencyMs: Date.now() - start,
          inputTokens: 0,
          outputTokens: 0,
          status: 'error',
          errorMessage: result.technicalMessage,
        });
        return result;
      }

      const response = result as AIResponse;

      // Cost tracking
      aiCostManagerService.trackExecution(ctx, {
        promptTokens: response.metadata.promptTokens,
        completionTokens: response.metadata.outputTokens,
        provider: response.metadata.provider,
        latencyMs: response.metadata.latencyMs,
        cacheHit: false,
      });

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

      return response.rawText;
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      await aiObservabilityService.logRequest({
        organizationId: ctx.organizationId,
        matchId,
        userId: ctx.userId,
        provider: 'grok',
        modelName: 'failover',
        latencyMs: Date.now() - start,
        inputTokens: 0,
        outputTokens: 0,
        status: 'error',
        errorMessage: errMsg,
      });

      return {
        status: 'error',
        requestId:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(),
        providerAttempted: 'grok',
        providerFailed: 'all',
        retryCount: 0,
        operatorMessage: 'The AI service is temporarily unavailable.',
        technicalMessage: errMsg,
        recommendedAction: 'Check gateway connectivity.',
      };
    }
  }
}

export const aiGatewayService = new AIGatewayService();
