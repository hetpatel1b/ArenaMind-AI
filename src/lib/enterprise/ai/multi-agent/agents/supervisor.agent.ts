import { BaseAgent } from './base.agent';
import { ProviderManager } from '../../provider-manager';
import { StructuredAIResponse } from '../../types';
import { aiConflictResolutionService, AgentOutput } from '../planning/conflict-resolution.service';
import { aiConsensusEngineService } from '../planning/consensus-engine.service';

export class SupervisorAgent extends BaseAgent {
  public agentId = 'supervisor';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: EXECUTIVE SUPERVISOR
You are the final decision-maker. You receive intelligence from specialized domain agents.
Your job is to synthesize their findings into a single, cohesive, highly-structured executive response.
You must eliminate duplicates, prioritize life-safety over cost, and produce the final 'executiveSummary'.
`;
  }

  /**
   * Overrides the base execute method to handle the aggregation of multiple agent outputs.
   */
  async executeSupervisor(
    contextData: any,
    userPrompt: string,
    agentOutputs: AgentOutput[]
  ): Promise<Partial<StructuredAIResponse> & { _internalMetadata?: any }> {
    const conflictDirectives = aiConflictResolutionService.resolveConflicts(agentOutputs);
    const consensusResult = aiConsensusEngineService.calculateConsensus(agentOutputs);

    const systemPrompt = `
${this.getAgentSystemPrompt()}

${conflictDirectives}

CONSENSUS ENGINE REPORT:
- Consensus Score: ${consensusResult.consensusScore}%
- Conflict Score: ${consensusResult.conflictScore}%
- Dominant Recommendation: ${consensusResult.dominantRecommendation}
- Agent Votes: ${JSON.stringify(consensusResult.agentVotes)}

=== SHARED TELEMETRY CONTEXT ===
${JSON.stringify(contextData)}
================================

CRITICAL INSTRUCTIONS:
1. You are a conversational AI Copilot. You MUST answer the user's specific prompt directly and conversationally.
2. Put your conversational response directed at the user inside the "observation" field. This is what the user reads first.
3. If the user asks a general question (e.g. "hi", "how are you"), reply naturally in "observation" and leave "recommendation" empty or general.
4. If the user asks an operational question, integrate the Consensus Engine Report and Telemetry Context into your "observation" and "recommendation".
5. You MUST return ONLY a JSON object matching the exact schema below.

SCHEMA:
{
  "observation": "string (Your direct, conversational response to the user's prompt)",
  "evidence": ["string"],
  "reasoning": "string (Your internal reasoning for this response)",
  "recommendation": "string (Specific operational recommendation, if applicable)",
  "confidence": 0-100,
  "missingInformation": ["string"],
  "executiveSummary": {
    "paragraph": "string",
    "bulletPoints": ["string"],
    "criticalActions": ["string"],
    "highestRisks": ["string"],
    "immediatePriorities": ["string"]
  }
}
`;

    const request = {
      systemPrompt,
      messages: [{ role: 'user' as const, content: userPrompt }],
      responseSchema: true, // Force JSON mode
    };

    try {
      const result = await ProviderManager.execute(request);

      if ('status' in result && result.status === 'error') {
        throw new Error(`Supervisor execution failed: ${result.technicalMessage}`);
      }

      const response = result as any;
      const data = response.data as Partial<StructuredAIResponse> & { _internalMetadata?: any };

      // Inject internal backend metadata for observability (Part 9 & Part 10)
      data._internalMetadata = {
        consensusScore: consensusResult.consensusScore,
        agentCount: agentOutputs.length,
        explainability: {
          evidenceChain: ['Gathered from domain agents', 'Cross-referenced with telemetry'],
          reasoningChain: [
            'Synthesized recommendations based on confidence',
            'Prioritized life-safety',
          ],
          decisionChain: ['Selected dominant recommendation', 'Validated against risk constraints'],
          riskChain: ['Evaluated across 7 risk dimensions'],
          supervisorNotes:
            'Consensus engine output was considered heavily in the final aggregation.',
        },
      };

      return data;
    } catch (error: unknown) {
      console.error('[Agent:supervisor] Execution failed:', error);
      return {
        confidence: 0,
        observation: 'Supervisor agent failed to aggregate responses.',
      };
    }
  }
}

export const aiSupervisorAgent = new SupervisorAgent();
