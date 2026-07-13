import { getServerSession, UserSessionContext } from './server-session';
import { AuthError, AuthorizationError, Role } from './constants';
import { hasPermission, Permission } from './permissions';

export async function requireAuth(): Promise<UserSessionContext> {
  const session = await getServerSession();
  if (!session) {
    throw new AuthError('Unauthorized access');
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]): Promise<UserSessionContext> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role as Role)) {
    throw new AuthorizationError();
  }
  return session;
}

export async function requirePermission(permission: Permission): Promise<UserSessionContext> {
  const session = await requireAuth();
  if (!hasPermission(session.role as Role, permission)) {
    throw new AuthorizationError(`Missing permission: ${permission}`);
  }
  return session;
}

export async function requireStadiumAccess(stadiumId: string): Promise<UserSessionContext> {
  const session = await requireAuth();

  if (session.role === 'system_admin') {
    return session;
  }

  if (session.stadiumId !== stadiumId) {
    throw new AuthorizationError('Cross-tenant access violation');
  }

  return session;
}
