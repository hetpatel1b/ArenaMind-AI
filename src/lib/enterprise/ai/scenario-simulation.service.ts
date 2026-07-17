export class ScenarioSimulationService {
  /**
   * Instructs the LLM to run branching what-if simulations before finalizing a recommendation.
   */
  getSimulationDirectives(): string {
    return `
SCENARIO SIMULATION DIRECTIVE:
Before selecting your final recommendation, you MUST mentally simulate the following distinct branches:
1. Approve (Full immediate response)
2. Ignore (Take no action, let it play out)
3. Delay (Wait 15 minutes for more data)
4. Escalate (Immediately involve executive/law enforcement)
5. Evacuate / Partial Response (Drastic mitigation)

For each branch, predict:
- Benefits
- Disadvantages
- Predicted Outcome
- Resource Usage
- Recovery Time
Select the best branches to include in your "alternatives" array.`;
  }
}

export const aiScenarioSimulationService = new ScenarioSimulationService();
