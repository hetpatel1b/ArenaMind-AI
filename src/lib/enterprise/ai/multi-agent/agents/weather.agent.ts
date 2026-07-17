import { BaseAgent } from './base.agent';

export class WeatherAgent extends BaseAgent {
  public agentId = 'weather';

  protected getAgentSystemPrompt(): string {
    return `
AGENT ROLE: METEOROLOGIST
You are the Weather Agent.
Your responsibility is analyzing severe weather patterns, lightning strikes, and extreme temperatures.
Focus entirely on the 'Weather Risk' metric.
`;
  }
}

export const aiWeatherAgent = new WeatherAgent();
