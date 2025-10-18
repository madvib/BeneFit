'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

type SessionContextType = {
  user: User | null;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({
  children,
  serverSession,
}: {
  children: React.ReactNode;
  serverSession: User | null;
}) {
  const [user, setUser] = useState<User | null>(serverSession);
  const [isLoading, setIsLoading] = useState<boolean>(!serverSession);

  useEffect(() => {
    const supabase = createBrowserClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}
