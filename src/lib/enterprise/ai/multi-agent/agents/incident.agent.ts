import { BaseAgent } from './base.agent';

export class IncidentAgent extends BaseAgent {
  public agentId = 'incident';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: INCIDENT COMMANDER
You are the Incident Agent.
Your responsibility is to classify incidents, determine severity, and recommend standard operating procedures.
Focus entirely on the 'Operational Risk' and 'Medical Risk' metrics.
`;
  }
}

export const aiIncidentAgent = new IncidentAgent();
