'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

import { UserSessionContext } from '@/lib/auth/server-session';

type AuthContextType = {
  user: User | null;
  session: Session | null;
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
  initialSession: Session | null;
}) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [userContext, setUserContext] = useState<UserSessionContext | null>(null);
  const [isLoading, setIsLoading] = useState(!initialSession);
  const [isContextLoading, setIsContextLoading] = useState(!!initialSession);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (session) {
      // eslint-disable-next-line
      setIsContextLoading(true);
      fetch('/api/auth/session')
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.refresh();
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
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
