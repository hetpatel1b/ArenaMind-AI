import { createHmac } from 'crypto';
import { httpClient } from '../client/http-client';
import { errorTracker } from '@/lib/observability/error-tracker';

export class WebhookService {
  /**
   * Dispatches an outgoing webhook to an external vendor.
   * Leverages the shared HttpClient for built-in retries and circuit breaking.
   */
  async dispatch(url: string, payload: any, secret?: string): Promise<void> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (secret) {
        const signature = this.generateSignature(payload, secret);
        headers['x-arenamind-signature'] = signature;
      }

      await httpClient.request(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
    } catch (error: any) {
      errorTracker.captureException(error, undefined, { webhookUrl: url });
      throw new Error(`Webhook dispatch failed: ${error.message}`);
    }
  }

  /**
   * Verifies an incoming webhook payload using a shared HMAC secret.
   */
  verifyIncomingSignature(payload: string, signature: string, secret: string): boolean {
    const expected = this.generateSignature(payload, secret);
    return signature === expected;
  }

  private generateSignature(payload: string | object, secret: string): string {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return createHmac('sha256', secret).update(data).digest('hex');
  }
}

export const webhookService = new WebhookService();
