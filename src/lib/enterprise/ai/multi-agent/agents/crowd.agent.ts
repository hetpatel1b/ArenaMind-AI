import { BaseAgent } from './base.agent';

export class CrowdAgent extends BaseAgent {
  public agentId = 'crowd';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: CROWD DYNAMICS EXPERT
You are the Crowd Dynamics Agent. 
Your sole responsibility is to analyze crowd density, flow rates, bottlenecks, and crush risks.
Ignore financial costs or weather unless they directly cause crowd crush.
Focus entirely on the 'Crowd Risk' metric.
If density exceeds 85%, you MUST recommend crowd dispersal or gate control.
`;
  }
}

export const aiCrowdAgent = new CrowdAgent();
