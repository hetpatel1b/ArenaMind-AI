import { ProviderFactory } from './provider-factory';
import { ProviderRegistry } from './provider-registry';
import { EnterpriseError } from './provider-types';
import { AIRequest, AIResponse, AIProviderType } from './types';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export class ProviderManager {
  private static isRetryable(error: SafeAny): boolean {
    if (!error || typeof error !== 'object') return false;

    const err = error as Record<string, SafeAny>;
    const status = err.status || err.statusCode;
    if (status === 401 || status === 403) return false;

    if (
      error instanceof SyntaxError ||
      (error instanceof Error && error.message?.toLowerCase().includes('json'))
    ) {
      return false;
    }

    if (
      status === 429 ||
      status === 500 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      (error instanceof Error && error.message?.toLowerCase().includes('timeout')) ||
      (error instanceof Error && error.message?.toLowerCase().includes('network')) ||
      (error instanceof Error && error.message?.toLowerCase().includes('fetch failed')) ||
      err.code === 'ECONNRESET' ||
      err.code === 'ETIMEDOUT'
    ) {
      return true;
    }

    return false;
  }

  private static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async execute(request: AIRequest): Promise<AIResponse | EnterpriseError> {
    const primary = ProviderRegistry.getPrimaryProvider();
    const fallback = ProviderRegistry.getFallbackProvider();

    let totalRetries = 0;

    try {
      return await this.tryProvider(primary, request, 2, [1000, 2000], (retries) => {
        totalRetries += retries;
      });
    } catch (primaryError: SafeAny) {
      const pErr = primaryError instanceof Error ? primaryError.message : String(primaryError);
      LoggerService.warn(`[ProviderManager] Primary provider (${primary}) failed:`, {
        error: pErr,
      });

      try {
        return await this.tryProvider(fallback, request, 1, [1000], (retries) => {
          totalRetries += retries;
        });
      } catch (fallbackError: SafeAny) {
        const fErr = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        LoggerService.error(`[ProviderManager] Fallback provider (${fallback}) failed:`, fErr);

        const isNodeCrypto = typeof crypto !== 'undefined' && crypto.randomUUID;

        return {
          status: 'error',
          requestId: crypto.randomUUID(),
          providerAttempted: primary,
          providerFailed: 'all',
          retryCount: totalRetries,
          operatorMessage:
            'The AI service is temporarily unavailable. Please try again in a few moments.',
          technicalMessage: `Both primary (${primary}) and fallback (${fallback}) providers failed.`,
          recommendedAction: 'Check provider API status pages or verify network connectivity.',
        } as EnterpriseError;
      }
    }
  }

  private static async tryProvider(
    providerType: AIProviderType,
    request: AIRequest,
    maxRetries: number,
    delays: number[],
    onRetryCountUpdate: (retries: number) => void
  ): Promise<AIResponse> {
    const provider = ProviderFactory.createProvider(providerType);
    let attempts = 0;

    while (true) {
      try {
        const response = await provider.generateResponse(request);
        onRetryCountUpdate(attempts);
        return response;
      } catch (error: SafeAny) {
        if (attempts < maxRetries && this.isRetryable(error)) {
          const delay = delays[attempts] || delays[delays.length - 1] || 1000;
          LoggerService.warn(
            `[ProviderManager] ${providerType} failed (retry ${attempts + 1}/${maxRetries}). Retrying in ${delay}ms...`
          );
          await this.sleep(delay);
          attempts++;
        } else {
          onRetryCountUpdate(attempts);
          throw error;
        }
      }
    }
  }
}
