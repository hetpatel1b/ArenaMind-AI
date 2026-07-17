import { AIMessage } from './types';

export class TokenBudgetService {
  private readonly CHARS_PER_TOKEN = 4;

  // E.g. Gemini 2.0 has 1-2 million context, but we might want a lower soft limit for speed/cost.
  private readonly MAX_TOKENS = 100000;

  estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / this.CHARS_PER_TOKEN);
  }

  estimateMessageTokens(message: AIMessage | { role: string; content: string }): number {
    return this.estimateTokens(message.content) + 10; // 10 tokens overhead per message
  }

  /**
   * Trims conversation history to fit within a specific token budget,
   * while prioritizing recent messages and critical information.
   */
  trimHistory(history: any[], maxTokens: number = 8000): any[] {
    let currentTokens = 0;
    const trimmedHistory: any[] = [];

    // Iterate backwards to keep the most recent messages
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const text = typeof msg.content === 'string' ? msg.content : msg.parts?.[0]?.text || '';
      const msgTokens = this.estimateTokens(text) + 10;

      // If we exceed the budget, stop adding (unless it's a critical message, which we could tag in the future)
      if (currentTokens + msgTokens > maxTokens) {
        break;
      }

      currentTokens += msgTokens;
      // Add to the front to maintain chronological order
      trimmedHistory.unshift(msg);
    }

    return trimmedHistory;
  }
}

export const aiTokenBudgetService = new TokenBudgetService();
