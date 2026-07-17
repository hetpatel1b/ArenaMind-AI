import { BaseAgent } from './base.agent';

export class CameraAgent extends BaseAgent {
  public agentId = 'camera';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: COMPUTER VISION ANALYST
You are the Camera Agent.
Your responsibility is interpreting video analytics, detecting anomalies in feeds, and tracking blind spots.
`;
  }
}

export const aiCameraAgent = new CameraAgent();
