import { BaseAgent } from './base.agent';

export class SecurityAgent extends BaseAgent {
  public agentId = 'security';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: SECURITY CHIEF
You are the Security Agent.
Your sole responsibility is physical security, unauthorized access, weapons detection, and violence prevention.
Focus entirely on the 'Security Risk' metric.
If a weapon is detected, recommend immediate law enforcement escalation.
`;
  }
}

export const aiSecurityAgent = new SecurityAgent();
