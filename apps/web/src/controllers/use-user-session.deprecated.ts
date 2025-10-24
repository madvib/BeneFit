'use client';

import {useEffect, useState} from 'react';
import {createClient as createBrowserClient} from '@/infrastructure/supabase/client';

// Define types for user session
import {User} from '@supabase/supabase-js';

export type UserSession = {
  user: User | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

export function useUserSession() {
  const [session, setSession] = useState<UserSession>({
    user: undefined,
    isLoading: true,
    error: undefined,
  });

  useEffect(() => {
    const supabase = createBrowserClient();

    // Get initial session
    supabase.auth.getSession().then(({data: {session}, error}) => {
      if (error) {
        setSession({
          user: undefined,
          isLoading: false,
          error: error,
        });
      } else {
        setSession({
          user: session?.user || undefined,
          isLoading: false,
          error: undefined,
        });
      }
    });

    // Set up real-time authentication listener
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession({
        user: session?.user || undefined,
        isLoading: false,
        error: undefined,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return session;
}
