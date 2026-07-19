/**
 * Context injected into Service layer operations.
 * Contains user session information, correlation IDs for logging, and multi-tenant scopes.
 */
export interface BusinessContext {
  /** The correlation ID tracing the request from UI to DB */
  correlationId: string;

  /** The user executing the action (if authenticated) */
  userId?: string;

  /** Multi-tenant boundary: The organization the user belongs to */
  organizationId?: string;

  /** The role of the user (e.g., 'operations_manager') */
  role?: string;

  /** Multi-tenant boundary: The venue the user is currently operating in */
  venueId: string;

  /** Additional metadata attached to the context */
  metadata?: Record<string, SafeAny>;
}

/**
 * Creates an empty/system context for automated jobs or unauthenticated actions.
 */
export function createSystemContext(venueId: string): BusinessContext {
  return {
    correlationId: crypto.randomUUID(),
    userId: 'system',
    role: 'system_admin',
    venueId,
  };
}
