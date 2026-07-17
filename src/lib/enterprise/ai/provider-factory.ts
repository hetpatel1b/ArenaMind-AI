import { BaseAIProvider } from './providers/base.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { GrokProvider } from './providers/grok.provider';
import { AIProviderType } from './types';
import { AIProviderOptions } from './types';

export class ProviderFactory {
  static createProvider(type: AIProviderType, options: AIProviderOptions = {}): BaseAIProvider {
    switch (type) {
      case 'grok':
        return new GrokProvider(options);
      case 'gemini':
        return new GeminiProvider(options);
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }
}
