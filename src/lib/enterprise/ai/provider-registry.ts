import { AIProviderType } from './types';

export class ProviderRegistry {
  static getPrimaryProvider(): AIProviderType {
    const primary = process.env.PRIMARY_AI_PROVIDER;
    if (primary === 'grok' || primary === 'gemini') {
      return primary as AIProviderType;
    }
    return 'grok';
  }

  static getFallbackProvider(): AIProviderType {
    const fallback = process.env.FALLBACK_AI_PROVIDER;
    if (fallback === 'grok' || fallback === 'gemini') {
      return fallback as AIProviderType;
    }
    return 'gemini';
  }
}
