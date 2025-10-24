"use client";

import { useSession } from "@/controllers/use-session";

interface User {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown; // Allow additional properties if needed
}

interface AuthCheckerProperties {
  children: (authState: {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | undefined;
  }) => React.ReactNode;
}

/**
 * Unified authentication checker that provides auth state to all header components
 */
export function AuthChecker({ children }: AuthCheckerProperties) {
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
