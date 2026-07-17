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

export class AgentOrchestratorService {
  private agentRegistry: Record<AgentId, any> = {
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
    contextData: any
  ): Promise<Partial<StructuredAIResponse>> {
    // 1. Task Planning
    const plan = aiTaskPlanningService.planExecution(userPrompt, featureName);

    // 2. Select Agents
    const agentsToRun = [plan.primaryAgent, ...plan.supportingAgents].map(
      (id) => this.agentRegistry[id]
    );

    // 3. Sequential Execution (prevents free-tier API rate limits during hackathon)
    const start = Date.now();
    const rawResults: PromiseSettledResult<Partial<StructuredAIResponse>>[] = [];
    for (const agent of agentsToRun) {
      try {
        const value = await agent.execute(contextData, userPrompt);
        rawResults.push({ status: 'fulfilled', value });
        // Stagger requests to avoid triggering burst rate limits
        await new Promise((r) => setTimeout(r, 800));
      } catch (reason) {
        rawResults.push({ status: 'rejected', reason });
      }
    }
    const latencyMs = Date.now() - start;

    // 4. Format outputs for Supervisor
    const agentOutputs: AgentOutput[] = rawResults.map((result, idx) => {
      const agentId = agentsToRun[idx].agentId;
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
    const finalResponse = await aiSupervisorAgent.executeSupervisor(
      contextData,
      userPrompt,
      agentOutputs
    );

    return finalResponse;
  }
}

export const aiAgentOrchestratorService = new AgentOrchestratorService();
