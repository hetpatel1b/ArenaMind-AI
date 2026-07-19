'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

import type { UserSessionContext } from '@/lib/auth/server-session';

type AuthContextType = {
  user: SafeAny | null;
  session: SafeAny | null;
  userContext: UserSessionContext | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: SafeAny | null;
}) {
  const { data: nextAuthSession, status } = useSession();
  const [session, setSession] = useState<unknown | null>(initialSession);
  const [user, setUser] = useState<unknown | null>(
    initialSession && typeof initialSession === 'object' && 'user' in initialSession
      ? (initialSession as Record<string, SafeAny>).user
      : null
  );
  const [userContext, setUserContext] = useState<UserSessionContext | null>(null);
  const [isLoading, setIsLoading] = useState(!initialSession);
  const [isContextLoading, setIsContextLoading] = useState(!!initialSession);

  useEffect(() => {
    if (session) {
      // eslint-disable-next-line
      setIsContextLoading(true);
      fetch('/api/auth/context')
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          setUserContext(data);
          setIsContextLoading(false);
        })
        .catch(() => {
          setUserContext(null);
          setIsContextLoading(false);
        });
    } else {
      setUserContext(null);
      setIsContextLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'loading') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      return;
    }

    if (nextAuthSession?.user) {
      setSession(nextAuthSession);
      setUser({
        id: nextAuthSession.user.id || '',
        email: nextAuthSession.user.email || '',
        user_metadata: {
          full_name: nextAuthSession.user.name || '',
        },
      });
    } else {
      setSession(null);
      setUser(null);
    }

    setIsLoading(false);
  }, [nextAuthSession, status]);

  const signOut = useCallback(async () => {
    // Clear next auth session directly
    await nextAuthSignOut({ redirect: true, callbackUrl: '/login' });
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      userContext,
      isLoading: isLoading || isContextLoading,
      signOut,
    }),
    [user, session, userContext, isLoading, isContextLoading, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
