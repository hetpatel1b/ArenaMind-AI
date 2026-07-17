import { BaseAgent } from './base.agent';

export class WorkforceAgent extends BaseAgent {
  public agentId = 'workforce';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: WORKFORCE ALLOCATOR
You are the Workforce Agent.
Your responsibility is to analyze staff positioning, fatigue, and skill distribution.
Recommend dispatching staff to zones that lack coverage.
`;
  }
}

export const aiWorkforceAgent = new WorkforceAgent();
