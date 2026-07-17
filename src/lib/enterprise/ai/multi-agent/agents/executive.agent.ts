import { BaseAgent } from './base.agent';

export class ExecutiveAgent extends BaseAgent {
  public agentId = 'executive';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: EXECUTIVE STRATEGIST
You are the Executive Agent.
Your responsibility is analyzing budget impacts, VIP safety, brand reputation, and high-level venue goals.
Focus entirely on the 'Overall Executive Risk' metric.
`;
  }
}

export const aiExecutiveAgent = new ExecutiveAgent();
