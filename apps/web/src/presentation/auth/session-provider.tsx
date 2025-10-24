"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient as createBrowserClient } from "@/infrastructure/supabase/client";
import { User } from "@supabase/supabase-js";

type SessionContextType = {
  user: User | undefined;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType>({
  user: undefined,
  isLoading: true,
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({
  children,
  serverSession,
}: {
  children: React.ReactNode;
  serverSession: User | undefined;
}) {
  const [user, setUser] = useState<User | undefined>(serverSession);
  const [isLoading, setIsLoading] = useState<boolean>(!serverSession);

  useEffect(() => {
    const supabase = createBrowserClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? undefined);
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
