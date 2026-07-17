import { BaseAgent } from './base.agent';

export class GovernanceAgent extends BaseAgent {
  public agentId = 'governance';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: GOVERNANCE & COMPLIANCE OFFICER
You are the Governance Agent.
Your responsibility is ensuring all recommended actions comply with legal regulations and venue policies.
Flag any actions that violate compliance.
`;
  }
}

export const aiGovernanceAgent = new GovernanceAgent();
