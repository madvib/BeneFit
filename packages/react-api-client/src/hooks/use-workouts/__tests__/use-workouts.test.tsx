// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../../test/setup.js';
import {
  useTodaysWorkout,
  useUpcomingWorkouts,
  useWorkoutHistory,
  useStartWorkout,
  useCompleteWorkout,
  useSkipWorkout,
  useJoinMultiplayerWorkout,
  useAddWorkoutReaction,
} from '../use-workouts.js';
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

  it('handles fetch error', async () => {
    server.use(
      http.get('http://*/api/workouts/today', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useTodaysWorkout(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
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

    const promise = result.current.mutateAsync({
      param: { sessionId: 'test-session-id' },
      json: { mode: 'solo' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('session');
  });

  it('handles start error', async () => {
    server.use(
      http.post('http://*/api/workouts/:sessionId/start', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useStartWorkout(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        param: { sessionId: 'test-session-id' },
        json: { mode: 'solo' },
      })
    ).rejects.toThrow();
  });
});

describe('useCompleteWorkout', () => {
  it('completes a workout session', async () => {
    const { result } = renderHook(() => useCompleteWorkout(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      param: { sessionId: 'test-session-id' },
      json: {
        performance: {
          setsCompleted: 15,
          totalReps: 150,
          totalWeight: 5000,
        },
      },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('workout');
  });
});

describe('useSkipWorkout', () => {
  it('skips a workout successfully', async () => {
    const { result } = renderHook(() => useSkipWorkout(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { reason: 'sick', workoutId: 'workout-123' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });

  it('handles skip error', async () => {
    server.use(
      http.post('http://*/api/workouts/skip', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useSkipWorkout(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: { reason: 'sick', workoutId: 'workout-123' },
      })
    ).rejects.toThrow();
  });
});

describe('useJoinMultiplayerWorkout', () => {
  it('joins multiplayer workout successfully', async () => {
    const { result } = renderHook(() => useJoinMultiplayerWorkout(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      param: { sessionId: 'session-123' },
      json: {},
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });
});

describe('useAddWorkoutReaction', () => {
  it('adds reaction successfully', async () => {
    const { result } = renderHook(() => useAddWorkoutReaction(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      param: { sessionId: 'session-123' },
      json: { reactionType: 'like' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });
});


