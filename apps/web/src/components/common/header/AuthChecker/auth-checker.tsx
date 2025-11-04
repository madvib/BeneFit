'use client';

import { useSession } from '@/controllers';

interface AuthCheckerProperties {
  children: (authState: {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: {
      id: string;
      email: string;
      name?: string;
    } | null;
  }) => React.ReactNode;
}

/**
 * Unified authentication checker that provides auth state to all header components
 */
export function AuthChecker({ children }: AuthCheckerProperties) {
  const { user, isLoading, isAuthenticated } = useSession();
  const isLoggedIn = isAuthenticated && !isLoading;

  return (
    <>
      {children({
        isLoggedIn,
        isLoading,
        user,
      })}
    </>
  );
}
