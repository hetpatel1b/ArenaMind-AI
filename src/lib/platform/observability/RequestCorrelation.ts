import { NextRequest } from 'next/server';

/**
 * Utility to extract or generate Request and Correlation IDs.
 * These should be propagated across services and included in logs.
 */
export class RequestCorrelation {
  static getCorrelationId(req: NextRequest): string {
    return req.headers.get('x-correlation-id') || crypto.randomUUID();
  }

  static getRequestId(req: NextRequest): string {
    return req.headers.get('x-request-id') || crypto.randomUUID();
  }

  static generateIds(req: NextRequest) {
    const requestId = this.getRequestId(req);
    const correlationId = this.getCorrelationId(req);

    // We clone the request headers and append the generated IDs
    const headers = new Headers(req.headers);
    headers.set('x-request-id', requestId);
    headers.set('x-correlation-id', correlationId);

    return { requestId, correlationId, headers };
  }
}
