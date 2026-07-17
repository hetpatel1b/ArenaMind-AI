'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

import type { UserSessionContext } from '@/lib/auth/server-session';

type AuthContextType = {
  user: any | null;
  session: any | null;
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
  initialSession: any | null;
}) {
  const { data: nextAuthSession, status } = useSession();
  const [session, setSession] = useState<any | null>(initialSession);
  const [user, setUser] = useState<any | null>(initialSession?.user ?? null);
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

  const signOut = async () => {
    // Clear next auth session directly
    await nextAuthSignOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userContext,
        isLoading: isLoading || isContextLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
