export class ExecutiveSummaryService {
  /**
   * Instructs the LLM on how to generate the concise executive summary payload.
   */
  getSummaryDirectives(): string {
    return `
EXECUTIVE BRIEFING DIRECTIVE:
You must provide a high-level executive summary of your findings:
1. 'paragraph': A single, hard-hitting paragraph summarizing the current operational state.
2. 'bulletPoints': Up to 5 bullet points of the most critical facts.
3. 'criticalActions': The immediate actions that must be taken.
4. 'highestRisks': The most severe risks identified.
5. 'immediatePriorities': What the match director needs to focus on in the next 15 minutes.
`;
  }
}

export const aiExecutiveSummaryService = new ExecutiveSummaryService();
