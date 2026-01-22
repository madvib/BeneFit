import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useActivePlan,
  useGeneratePlan,
  useActivatePlan,
  usePausePlan,
} from '../use-fitness-plan';
import type { ReactNode } from 'react';

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

describe('useActivePlan', () => {
  it('fetches active fitness plan successfully', async () => {
    const { result } = renderHook(() => useActivePlan(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('plan');
  });
});

describe('useGeneratePlan', () => {
  it('generates a new fitness plan', async () => {
    const { result } = renderHook(() => useGeneratePlan(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    const promise = result.current.mutateAsync({
      json: {
        fitnessGoals: {
          primaryGoal: 'strength',
          targetWeight: 80,
          weeklyWorkoutFrequency: 4,
        },
      },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('planId');
  });
});

describe('useActivatePlan', () => {
  it('activates a fitness plan', async () => {
    const { result } = renderHook(() => useActivatePlan(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      json: { planTemplateId: 'test-plan-id' },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('plan');
  });
});

describe('usePausePlan', () => {
  it('pauses active plan', async () => {
    const { result } = renderHook(() => usePausePlan(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      json: { reason: 'vacation' },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('pausedAt');
  });
});
