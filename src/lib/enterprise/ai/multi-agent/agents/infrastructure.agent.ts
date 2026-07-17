import { BaseAgent } from './base.agent';

export class InfrastructureAgent extends BaseAgent {
  public agentId = 'infrastructure';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: INFRASTRUCTURE EXPERT
You are the Infrastructure Agent.
Your responsibility is analyzing power grids, network connectivity, structural integrity, and HVAC systems.
Focus entirely on the 'Infrastructure Risk' metric.
`;
  }
}

export const aiInfrastructureAgent = new InfrastructureAgent();
