import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '../auth/server-session';
import { mapErrorToResponse } from '../errors/error.mapper';
import { BusinessContext, createSystemContext } from '../services/business.context';
import { Role } from '../auth/constants';
import { hasPermission, Permission } from '../auth/permissions';
import { AuthorizationError, AuthenticationError } from '../errors/http.errors';
import { logger } from '../observability/logger';
import { enforceRateLimit, RateLimitOptions } from './rate-limiter';
import { generateETag, checkConditionalCache } from './caching';

export interface RouteConfig {
  requireAuth?: boolean;
  allowedRoles?: Role[];
  requiredPermissions?: Permission[];
  /** If true, bypasses the strict stadium isolation check (Admin only) */
  globalAccess?: boolean;
  rateLimit?: RateLimitOptions;
}

export type RouteHandler = (
  req: NextRequest,
  context: { params?: any; bizContext: BusinessContext }
) => Promise<NextResponse>;

/**
 * Higher-Order Function that creates a standardized Next.js Route Handler.
 * Automatically handles:
 * 1. Authentication & Session Extraction
 * 2. Role-Based Access Control
 * 3. Business Context Generation (Correlation IDs)
 * 4. Global Error Catching & Formatting
 */
export function createRouteHandler(
  handler: RouteHandler,
  config: RouteConfig = { requireAuth: true }
) {
  return async (req: NextRequest, context?: { params?: any }): Promise<NextResponse> => {
    const params = context?.params;
    const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID();

    try {
      let bizContext: BusinessContext;

      if (config.requireAuth) {
        const session = await getServerSession();
        if (!session) {
          throw new AuthenticationError('Authentication required');
        }

        // Validate Roles
        if (config.allowedRoles && !config.allowedRoles.includes(session.role as Role)) {
          throw new AuthorizationError('Role not authorized for this endpoint');
        }

        // Validate Permissions
        if (config.requiredPermissions) {
          for (const perm of config.requiredPermissions) {
            if (!hasPermission(session.role as Role, perm)) {
              throw new AuthorizationError(`Missing required permission: ${perm}`);
            }
          }
        }

        bizContext = {
          correlationId,
          userId: session.userId,
          role: session.role,
          stadiumId: session.stadiumId,
        };
      } else {
        // Public endpoint, use system context tied to a default tenant
        bizContext = createSystemContext('public');
        bizContext.correlationId = correlationId;
      }

      // 3. Enforce Rate Limiting if configured
      if (config.rateLimit) {
        const identifier =
          (config.requireAuth ? bizContext!.userId : req.headers.get('x-forwarded-for')) ||
          'anonymous';
        await enforceRateLimit(req, identifier, config.rateLimit);
      }

      const startTime = performance.now();
      logger.info(`Incoming API Request: ${req.method} ${req.nextUrl.pathname}`, { correlationId });

      // Execute the actual business logic
      const response = await handler(req, { params, bizContext });

      // Automatic ETag Generation & Caching for GET requests
      if (req.method === 'GET' && response.status === 200) {
        const clonedRes = response.clone();
        const text = await clonedRes.text();
        const etag = generateETag(text);

        const cachedRes = checkConditionalCache(req, etag);
        if (cachedRes) return cachedRes;

        response.headers.set('ETag', etag);
        // Short private cache to prevent stale dashboard data, but allow browser reuse
        response.headers.set('Cache-Control', 'private, max-age=10, stale-while-revalidate=30');
      }

      const durationMs = Math.round(performance.now() - startTime);
      logger.info(`Outgoing API Response: ${req.method} ${req.nextUrl.pathname}`, {
        correlationId,
        durationMs,
        status: response.status,
      });

      return response;
    } catch (error) {
      // All uncaught errors bubble up to here and are safely mapped to HTTP responses
      return mapErrorToResponse(error, { correlationId, path: req.nextUrl.pathname });
    }
  };
}
