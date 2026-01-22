import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useTodaysWorkout,
  useUpcomingWorkouts,
  useWorkoutHistory,
  useStartWorkout,
  useCompleteWorkout,
} from '../use-workouts';
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

describe('useTodaysWorkout', () => {
  it('fetches todays workout successfully', async () => {
    const { result } = renderHook(() => useTodaysWorkout(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('workout');
  });
});

describe('useUpcomingWorkouts', () => {
  it('fetches upcoming workouts successfully', async () => {
    const { result } = renderHook(
      () => useUpcomingWorkouts({ query: { limit: 5 } }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('workouts');
    expect(Array.isArray(result.current.data?.workouts)).toBe(true);
  });
});

describe('useWorkoutHistory', () => {
  it('fetches workout history successfully', async () => {
    const { result } = renderHook(
      () => useWorkoutHistory({ query: { limit: 10 } }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('workouts');
    expect(Array.isArray(result.current.data?.workouts)).toBe(true);
  });
});

describe('useStartWorkout', () => {
  it('starts a workout session', async () => {
    const { result } = renderHook(() => useStartWorkout(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      param: { sessionId: 'test-session-id' },
      json: { mode: 'solo' },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('session');
  });
});

describe('useCompleteWorkout', () => {
  it('completes a workout session', async () => {
    const { result } = renderHook(() => useCompleteWorkout(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      param: { sessionId: 'test-session-id' },
      json: {
        performance: {
          setsCompleted: 15,
          totalReps: 150,
          totalWeight: 5000,
        },
      },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('workout');
  });
});
