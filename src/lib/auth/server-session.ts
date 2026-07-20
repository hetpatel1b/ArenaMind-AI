import { auth } from '@/server/auth/auth';
import { UserRole } from '@prisma/client';
import { organizationResolver } from '@/lib/services/organization-resolver';
import { isUUID, SYSTEM_USER_ID } from '@/lib/validation/uuid';

export type UserSessionContext = {
  authId: string;
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
};

export async function getServerSession(): Promise<UserSessionContext | null> {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const user = session.user;
  const resolvedOrgId = await organizationResolver.resolveOrganizationId(user.organizationId);
  const validUserId = isUUID(user.id) ? user.id : SYSTEM_USER_ID;

  return {
    authId: validUserId,
    userId: validUserId,
    email: user.email || '',
    role: user.role as UserRole,
    organizationId: resolvedOrgId,
  };
}
