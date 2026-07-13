export interface AiPromptOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface IAiProvider {
  /**
   * Generates a text completion based on a prompt.
   * Foundation for Phase 3 LLM operations.
   */
  generateCompletion(prompt: string, opts?: AiPromptOptions): Promise<string>;
}
