export interface AgentOutput {
  agentId: string;
  recommendation: string;
  confidence: number;
  evidence: string[];
}

export class ConflictResolutionService {
  /**
   * Generates a prompt directive for the Supervisor Agent to resolve conflicts
   * between the outputs of different domain agents.
   */
  resolveConflicts(agentOutputs: AgentOutput[]): string {
    if (agentOutputs.length <= 1) return '';

    let conflictPrompt = `
CONFLICT RESOLUTION DIRECTIVE:
You are the Executive Supervisor. You have received reports from multiple specialized domain agents.
You must synthesize their findings, but more importantly, you must RESOLVE CONFLICTS.
If the Mobility Agent suggests closing a gate that the Crowd Agent says is necessary for egress, you must weigh:
1. Agent Confidence
2. Evidence Quality
3. Business Priority (Life Safety > Operations)

Here are the agent outputs:
`;

    agentOutputs.forEach((output) => {
      conflictPrompt += `\n--- [${output.agentId.toUpperCase()} AGENT] (Confidence: ${output.confidence}%) ---\n`;
      conflictPrompt += `Recommendation: ${output.recommendation}\n`;
      conflictPrompt += `Evidence: ${output.evidence.join(' | ')}\n`;
    });

    return conflictPrompt;
  }
}

export const aiConflictResolutionService = new ConflictResolutionService();
