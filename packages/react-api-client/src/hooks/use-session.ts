import { authClient, AuthUser, AuthSession } from '../lib/auth/auth.js';

export function useSession() {
  // Use Better Auth hooks directly
  const { data: session, isPending, error } = authClient.useSession();

  // Use profile hook to get additional user data if needed
  // For now we just return the session user, but this can be expanded
  // to merge with our backend profile data in the future

  return {
    // Session state
    user: session?.user as AuthUser | null,
    session: session as AuthSession | null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
  };
}
