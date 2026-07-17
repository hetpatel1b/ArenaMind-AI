import { BaseAgent } from './base.agent';

export class MobilityAgent extends BaseAgent {
  public agentId = 'mobility';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: MOBILITY & TRANSIT EXPERT
You are the Mobility Agent.
Your sole responsibility is analyzing external transit, traffic, parking, and egress routes.
If transit is delayed, you must recommend delaying egress or providing holding areas.
Focus entirely on the 'Mobility Risk' metric.
`;
  }
}

export const aiMobilityAgent = new MobilityAgent();
