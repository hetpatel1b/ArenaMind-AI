import { AIProviderType, AIRequest, AIResponse } from './types';

export interface EnterpriseError {
  status: 'error';
  requestId: string;
  providerAttempted: AIProviderType;
  providerFailed: AIProviderType | 'all';
  retryCount: number;
  operatorMessage: string;
  technicalMessage: string;
  recommendedAction: string;
}

export interface ProviderManagerOptions {
  primaryProvider: AIProviderType;
  fallbackProvider: AIProviderType;
}

export interface RetryContext {
  attempts: number;
  provider: AIProviderType;
  lastError?: Error;
}
