import { aiTaskPlanningService, AgentId } from './planning/task-planning.service';
import { aiCrowdAgent } from './agents/crowd.agent';
import { aiIncidentAgent } from './agents/incident.agent';
import { aiMobilityAgent } from './agents/mobility.agent';
import { aiCameraAgent } from './agents/camera.agent';
import { aiWorkforceAgent } from './agents/workforce.agent';
import { aiInfrastructureAgent } from './agents/infrastructure.agent';
import { aiGovernanceAgent } from './agents/governance.agent';
import { aiWeatherAgent } from './agents/weather.agent';
import { aiSecurityAgent } from './agents/security.agent';
import { aiExecutiveAgent } from './agents/executive.agent';
import { aiSupervisorAgent } from './agents/supervisor.agent';
import { AgentOutput } from './planning/conflict-resolution.service';
import { StructuredAIResponse } from '../types';

interface OrchestratorAgent {
  agentId: string;
  execute(contextData: SafeAny, userPrompt: string): Promise<Partial<StructuredAIResponse>>;
}

export class AgentOrchestratorService {
  private agentRegistry: Record<AgentId, OrchestratorAgent> = {
    crowd: aiCrowdAgent,
    incident: aiIncidentAgent,
    mobility: aiMobilityAgent,
    camera: aiCameraAgent,
    workforce: aiWorkforceAgent,
    infrastructure: aiInfrastructureAgent,
    governance: aiGovernanceAgent,
    weather: aiWeatherAgent,
    security: aiSecurityAgent,
    executive: aiExecutiveAgent,
  };

  /**
   * The core engine of the Multi-Agent architecture.
   * Replaces the single LLM call with a swarmed execution strategy.
   */
  async orchestrate(
    userPrompt: string,
    featureName: string,
    contextData: SafeAny,
    onProgress?: (msg: string) => void
  ): Promise<Partial<StructuredAIResponse>> {
    // 1. Task Planning
    const plan = aiTaskPlanningService.planExecution(userPrompt, featureName);

    // 2. Select Agents
    const agentsToRun = [plan.primaryAgent, ...plan.supportingAgents].map(
      (id) => this.agentRegistry[id]
    );

    // 3. Concurrent Execution for Enterprise Performance
    if (onProgress) onProgress('Domain agents analyzing data concurrently...');
    const start = Date.now();

    const rawResults = await Promise.allSettled(
      agentsToRun.map(async (agent) => {
        const result = await agent.execute(contextData, userPrompt);
        if (onProgress) onProgress(`Agent ${agent.agentId} completed analysis.`);
        return result;
      })
    );

    const latencyMs = Date.now() - start;

    // 4. Format outputs for Supervisor
    const agentOutputs: AgentOutput[] = rawResults.map((result, idx) => {
      const agent = agentsToRun[idx];
      const agentId = agent ? agent.agentId : 'unknown';
      if (result.status === 'fulfilled' && result.value) {
        return {
          agentId,
          recommendation: result.value.recommendation || 'No specific recommendation provided.',
          confidence: result.value.confidence || 0,
          evidence: result.value.evidence || [],
        };
      }
      return {
        agentId,
        recommendation: 'Agent failed to complete task.',
        confidence: 0,
        evidence: [],
      };
    });

    // 5. Supervisor Aggregation & Conflict Resolution
    if (onProgress) onProgress('Supervisor agent resolving conflicts...');
    const finalResponse = await aiSupervisorAgent.executeSupervisor(
      contextData,
      userPrompt,
      agentOutputs
    );

    return finalResponse;
  }
}

export const aiAgentOrchestratorService = new AgentOrchestratorService();
