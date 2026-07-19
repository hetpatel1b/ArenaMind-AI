import { getServerSession, UserSessionContext } from './server-session';
import { AuthError, AuthorizationError } from './constants';
import { hasPermission, Permission } from './permissions';
import { UserRole } from '@prisma/client';

export async function requireAuth(): Promise<UserSessionContext> {
  const session = await getServerSession();
  if (!session) {
    throw new AuthError('Unauthorized access');
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<UserSessionContext> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new AuthorizationError();
  }
  return session;
}

export async function requirePermission(permission: Permission): Promise<UserSessionContext> {
  const session = await requireAuth();
  if (!hasPermission(session.role, permission)) {
    throw new AuthorizationError(`Missing permission: ${permission}`);
  }
  return session;
}

export async function requireStadiumAccess(venueId: string): Promise<UserSessionContext> {
  const session = await requireAuth();

  if (session.role === UserRole.super_admin || session.role === UserRole.organization_admin) {
    return session;
  }

  if (session.organizationId !== venueId) {
    throw new AuthorizationError('You do not have access to this venue');
  }

  return session;
}
