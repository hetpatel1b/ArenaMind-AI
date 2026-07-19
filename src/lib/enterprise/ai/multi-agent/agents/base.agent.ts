import { AIRequest, AIResponse, StructuredAIResponse, AIProviderType } from '../../types';
import { ProviderManager } from '../../provider-manager';
import { aiSecurityService } from '../../security.service';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export abstract class BaseAgent {
  public abstract agentId: string;

  /**
   * Each specialized agent must define its own core objective and rules of engagement.
   */
  protected abstract getAgentSystemPrompt(): string;

  /**
   * Executes the agent's core task against the LLM provider.
   */
  async execute(contextData: SafeAny, userPrompt: string): Promise<Partial<StructuredAIResponse>> {
    const systemPrompt = `
${this.getAgentSystemPrompt()}

=== SHARED TELEMETRY CONTEXT ===
${JSON.stringify(contextData)}
================================

CRITICAL INSTRUCTION: You MUST return a JSON object matching this schema. Fill in at least "observation", "reasoning", and "recommendation" with valid strings.
{
  "observation": "string",
  "evidence": ["string"],
  "reasoning": "string",
  "recommendation": "string",
  "confidence": 0-100,
  "missingInformation": ["string"]
}
`;

    const request: AIRequest = {
      systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      responseSchema: true, // Force JSON mode
    };

    try {
      const result = await aiSecurityService.enforceTimeout(
        ProviderManager.execute(request),
        15000
      );

      if ('status' in result && result.status === 'error') {
        throw new Error(`ProviderManager failed: ${result.technicalMessage}`);
      }

      const response = result as AIResponse;
      return response.data as Partial<StructuredAIResponse>;
    } catch (error) {
      LoggerService.error(`[Agent:${this.agentId}] Execution failed:`, error);
      return {
        confidence: 0,
        observation: `Agent ${this.agentId} failed to respond.`,
      };
    }
  }
}
