import { AIRequest, AIResponse, AIProviderOptions } from '../types';

export abstract class BaseAIProvider {
  protected options: AIProviderOptions;

  constructor(options: AIProviderOptions) {
    this.options = options;
  }

  abstract generateResponse(request: AIRequest): Promise<AIResponse>;
}
