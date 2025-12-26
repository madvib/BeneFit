import { getAuthClient } from '../auth';
import { useCallback } from 'react';

export function useAuth() {
  const authClient = getAuthClient();

  // Use Better Auth hooks directly
  const { data: session, isPending, error } = authClient.useSession();

  // Platform-agnostic auth methods
  const login = useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  }, [authClient]);

  const logout = useCallback(async () => {
    const result = await authClient.signOut();
    return result;
  }, [authClient]);

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string
  ) => {
    const result = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  }, [authClient]);

  return {
    // Session state
    user: session?.user,
    session,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,

    // Platform-agnostic auth methods (no routing)
    login,
    logout,
    signup,

    // Direct access to auth client for advanced usage
    authClient,
  };
}