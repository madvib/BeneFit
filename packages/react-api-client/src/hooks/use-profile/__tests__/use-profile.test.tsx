import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile } from '../use-profile';
import type { ReactNode } from 'react';

/**
 * Test wrapper with React Query provider
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useGetProfile', () => {
  it('fetches user profile successfully', async () => {
    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for success
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify data structure
    expect(result.current.data).toHaveProperty('userId');
    expect(result.current.data).toHaveProperty('fitnessGoals');
    expect(result.current.data).toHaveProperty('preferences');
  });
});
