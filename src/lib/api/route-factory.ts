import { NextRequest, NextResponse } from 'next/server';
import { mapErrorToResponse } from '../errors/error.mapper';
import { BusinessContext, createSystemContext } from '../services/business.context';
import { UserRole } from '@prisma/client';
import { hasPermission, Permission } from '../auth/permissions';
import { AuthorizationError, AuthenticationError } from '../errors/http.errors';
import { logger } from '../observability/logger';
import { enforceRateLimit, RateLimitOptions } from './rate-limiter';
import { generateETag, checkConditionalCache } from './caching';
import { isUUID, SYSTEM_ORGANIZATION_ID, SYSTEM_USER_ID } from '../validation/uuid';

export interface RouteConfig {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  /** If true, bypasses the strict venue isolation check (Admin only) */
  globalAccess?: boolean;
  rateLimit?: RateLimitOptions;
}

export type RouteHandler = (
  req: NextRequest,
  context: { params?: SafeAny; bizContext: BusinessContext }
) => Promise<NextResponse | Response>;

function getUserFromHeaders(req: Request) {
  const id = req.headers.get('x-user-id');
  const role = req.headers.get('x-user-role') as UserRole | null;

  if (!id || !role) return null;

  return {
    id,
    role,
    organizationId: req.headers.get('x-user-organization-id') || null,
  };
}

/**
 * Higher-Order Function that creates a standardized Next.js Route Handler.
 * Automatically handles:
 * 1. Authentication & Session Extraction (via Edge Middleware Headers)
 * 2. Role-Based Access Control
 * 3. Business Context Generation (Correlation IDs)
 * 4. Global Error Catching & Formatting
 */
export function createRouteHandler(
  handler: RouteHandler,
  config: RouteConfig = { requireAuth: true }
) {
  return async (
    req: NextRequest,
    context?: { params?: SafeAny | Promise<SafeAny> }
  ): Promise<NextResponse | Response> => {
    const params =
      context?.params instanceof Promise ? await context.params : await context?.params;
    const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID();

    try {
      let bizContext: BusinessContext;

      if (config.requireAuth) {
        const user = getUserFromHeaders(req);
        if (!user) {
          throw new AuthenticationError('Authentication required');
        }

        // Validate Roles
        if (config.allowedRoles && !config.allowedRoles.includes(user.role)) {
          throw new AuthorizationError('Role not authorized for this endpoint');
        }

        // Validate Permissions
        if (config.requiredPermissions) {
          for (const perm of config.requiredPermissions) {
            if (!hasPermission(user.role, perm)) {
              throw new AuthorizationError(`Missing required permission: ${perm}`);
            }
          }
        }

        bizContext = {
          correlationId,
          userId: user.id,
          role: user.role,
          organizationId: user.organizationId as string,
          venueId: user.organizationId as string,
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
      logger.info(`Incoming API Request: ${req.method} ${req.nextUrl.pathname}`, {
        correlationId,
        userId: bizContext.userId,
        organizationId: bizContext.venueId,
      });

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
        userId: bizContext.userId,
        organizationId: bizContext.venueId,
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
