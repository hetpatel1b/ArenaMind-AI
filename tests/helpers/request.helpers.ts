import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';

export interface MockRequestOptions {
  method?: string;
  url?: string;
  body?: any;
  userId?: string;
  role?: UserRole;
  organizationId?: string;
  headers?: Record<string, string>;
}

/**
 * Helper to generate a NextRequest for API route integration testing.
 * Injects required Edge Middleware headers used by the RouteFactory.
 */
export function createMockRequest(options: MockRequestOptions = {}): NextRequest {
  const method = options.method || 'GET';
  const url = options.url || 'http://localhost/api/test';

  const headers = new Headers(options.headers || {});

  if (options.userId) {
    headers.set('x-user-id', options.userId);
  }

  if (options.role) {
    headers.set('x-user-role', options.role);
  }

  if (options.organizationId) {
    headers.set('x-user-organization-id', options.organizationId);
  }

  const reqInit: any = {
    method,
    headers,
  };

  if (options.body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    reqInit.body = JSON.stringify(options.body);
  }

  return new NextRequest(url, reqInit);
}
