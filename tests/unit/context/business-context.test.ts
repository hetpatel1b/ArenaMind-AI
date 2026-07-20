import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createRouteHandler } from '../../../src/lib/api/route-factory';
import { createSystemContext } from '../../../src/lib/services/business.context';
import { SYSTEM_USER_ID } from '../../../src/lib/validation/uuid';

// Mock dependencies that are not the subject of this unit test
vi.mock('../../../src/lib/observability/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../../src/lib/api/rate-limiter', () => ({
  enforceRateLimit: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../../src/lib/api/caching', () => ({
  generateETag: vi.fn().mockReturnValue('mock-etag'),
  checkConditionalCache: vi.fn().mockReturnValue(null),
}));

function createMockRequest(headers: Record<string, string>) {
  return new NextRequest('http://localhost/api/test', {
    headers: new Headers(headers),
  });
}

describe('BusinessContext & RouteFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSystemContext', () => {
    it('creates a system context with provided venue', () => {
      const ctx = createSystemContext('venue-123');
      expect(ctx.userId).toBe(SYSTEM_USER_ID);
      expect(ctx.role).toBe('system_admin');
      expect(ctx.venueId).toBe('venue-123');
      expect(ctx.correlationId).toBeDefined();
    });
  });

  describe('createRouteHandler & Header Parsing', () => {
    it('extracts headers and propagates tenant/role to bizContext', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
      const route = createRouteHandler(mockHandler, { requireAuth: true });

      const req = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'COMMANDER',
        'x-user-organization-id': 'org-456',
        'x-correlation-id': 'corr-789',
      });

      await route(req);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      const passedContext = mockHandler.mock.calls[0]![1]!.bizContext!;

      expect(passedContext.userId).toBe('user-123');
      expect(passedContext.role).toBe('COMMANDER');
      expect(passedContext.venueId).toBe('org-456');
      expect(passedContext.correlationId).toBe('corr-789');
    });

    it('rejects requests with missing required headers (AuthenticationError)', async () => {
      const mockHandler = vi.fn();
      const route = createRouteHandler(mockHandler, { requireAuth: true });

      // Missing x-user-id
      const req = createMockRequest({
        'x-user-role': 'COMMANDER',
        'x-user-organization-id': 'org-456',
      });

      const response = await route(req);

      // Because it maps errors to response, it should be 401
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error.message).toBe('Authentication required');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('rejects unauthorized roles (AuthorizationError)', async () => {
      const mockHandler = vi.fn();
      const route = createRouteHandler(mockHandler, {
        requireAuth: true,
        allowedRoles: ['super_admin' as any],
      });

      const req = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'COMMANDER', // Not allowed
        'x-user-organization-id': 'org-456',
      });

      const response = await route(req);

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error.message).toBe('Role not authorized for this endpoint');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('creates system context for public endpoints without headers', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
      const route = createRouteHandler(mockHandler, { requireAuth: false });

      const req = createMockRequest({}); // No headers

      await route(req);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      const passedContext = mockHandler.mock.calls[0]![1]!.bizContext!;

      expect(passedContext.userId).toBe(SYSTEM_USER_ID);
      expect(passedContext.venueId).toBe('public');
    });

    it('generates a correlation ID if missing', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
      const route = createRouteHandler(mockHandler, { requireAuth: true });

      const req = createMockRequest({
        'x-user-id': 'user-123',
        'x-user-role': 'COMMANDER',
        'x-user-organization-id': 'org-456',
        // No x-correlation-id
      });

      await route(req);

      const passedContext = mockHandler.mock.calls[0]![1]!.bizContext!;
      expect(passedContext.correlationId).toBeDefined();
      expect(passedContext.correlationId.length).toBeGreaterThan(0);
    });
  });
});
