import { NextResponse } from 'next/server';
import { auth } from '../auth/auth';
import { UserRole } from '@prisma/client';

export type AuthenticatedRequest = Request & {
  user: {
    id: string;
    role: UserRole;
    organizationId: string | null;
  };
};

type ApiHandler = (req: AuthenticatedRequest, params?: any) => Promise<NextResponse> | NextResponse;

/**
 * Higher-order function to protect API routes with NextAuth and RBAC.
 */
export function withRole(allowedRoles: UserRole[], handler: ApiHandler) {
  return async (req: Request, params?: any) => {
    try {
      const session = await auth();

      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userRole = session.user.role as UserRole;

      if (userRole !== 'super_admin' && !allowedRoles.includes(userRole)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Attach user to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        id: session.user.id as string,
        role: userRole,
        organizationId: session.user.organizationId || null,
      };

      return await handler(authenticatedReq, params);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}

/**
 * Middleware for actions that only require a valid session.
 */
export function withAuth(handler: ApiHandler) {
  return async (req: Request, params?: any) => {
    try {
      const session = await auth();

      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        id: session.user.id as string,
        role: session.user.role as UserRole,
        organizationId: session.user.organizationId || null,
      };

      return await handler(authenticatedReq, params);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}
