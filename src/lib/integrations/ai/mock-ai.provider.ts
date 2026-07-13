import { IAiProvider, AiPromptOptions } from './ai.interface';

export class MockAiProvider implements IAiProvider {
  async generateCompletion(prompt: string, opts?: AiPromptOptions): Promise<string> {
    // Phase 3 foundation: Mock LLM response
    return `[Mock AI Response for prompt length: ${prompt.length}]`;
  }
}

export const aiProvider: IAiProvider = new MockAiProvider();
