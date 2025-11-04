'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { getSession } from './session';

// Define the session context type
export type SessionContextType = {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshSession: async () => {},
});

// Custom hook that uses the session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Session provider component that fetches session data
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      const result = await getSession();
      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuthenticated(result.data.isAuthenticated);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    await fetchSession();
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
