import { createServerSupabaseClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/client';

export type UserSessionContext = {
  authId: string;
  userId: string;
  email: string;
  role: string;
  stadiumId: string;
};

export async function getServerSession(): Promise<UserSessionContext | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      role: true,
      stadiumId: true,
      isActive: true,
    },
  });

  if (!dbUser || !dbUser.isActive) {
    return null;
  }

  return {
    authId: user.id,
    userId: dbUser.id,
    email: user.email || '',
    role: dbUser.role,
    stadiumId: dbUser.stadiumId,
  };
}
