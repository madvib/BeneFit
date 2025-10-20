"use client";

import { useEffect, useState } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

// Define types for user session
import { User } from "@supabase/supabase-js";

export type UserSession = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export function useUserSession() {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createBrowserClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setSession({
          user: null,
          isLoading: false,
          error: error,
        });
      } else {
        setSession({
          user: session?.user || null,
          isLoading: false,
          error: null,
        });
      }
    });

    // Set up real-time authentication listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession({
        user: session?.user || null,
        isLoading: false,
        error: null,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return session;
}
