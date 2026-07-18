import { auth } from '@/server/auth/auth';

export type UserSessionContext = {
  authId: string;
  userId: string;
  email: string;
  role: string;
  organizationId: string | null;
};

export async function getServerSession(): Promise<UserSessionContext | null> {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const user = session.user;

  return {
    authId: user.id,
    userId: user.id,
    email: user.email || '',
    role: user.role || 'user',
    organizationId: user.organizationId || null,
  };
}
