"use client";

import { useSession } from "@/hooks/useSession";

interface User {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown; // Allow additional properties if needed
}

interface AuthCheckerProps {
  children: (authState: {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
  }) => React.ReactNode;
}

/**
 * Unified authentication checker that provides auth state to all header components
 */
export function AuthChecker({ children }: AuthCheckerProps) {
  const { user, isLoading } = useSession();
  const isLoggedIn = !!user && !isLoading;

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
