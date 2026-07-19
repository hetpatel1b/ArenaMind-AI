import { NextRequest } from 'next/server';

/**
 * Creates a mock NextRequest suitable for unit testing Route Handlers.
 */
export function createMockRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: {
    body?: unknown;
    headers?: Record<string, string>;
    searchParams?: Record<string, string>;
  }
): NextRequest {
  const reqUrl = new URL(url, 'http://localhost:3000');

  if (options?.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      reqUrl.searchParams.append(key, value);
    });
  }

  const reqOptions: any = {
    method,
    headers: new Headers(options?.headers),
  };

  if (options?.body) {
    reqOptions.body = JSON.stringify(options.body);
    (reqOptions.headers as Headers).set('Content-Type', 'application/json');
  }

  return new NextRequest(reqUrl.toString(), reqOptions);
}
