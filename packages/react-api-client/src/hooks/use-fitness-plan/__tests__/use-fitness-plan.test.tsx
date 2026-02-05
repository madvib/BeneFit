// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../../test/setup.js';
import {
  useActivePlan,
  useGeneratePlan,
  useActivatePlan,
  usePausePlan,
  useAdjustPlan,
} from '../use-fitness-plan.js';
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

  it('handles error fetching plan', async () => {
    server.use(
      http.get('http://*/api/fitness-plan/active', () => {
        return HttpResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useActivePlan(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
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

  it('handles generation error', async () => {
    server.use(
      http.post('http://*/api/fitness-plan/generate', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useGeneratePlan(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: {
          fitnessGoals: {
            primaryGoal: 'strength',
            targetWeight: 80,
            weeklyWorkoutFrequency: 4,
          },
        },
      })
    ).rejects.toThrow();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useActivatePlan', () => {
  it('activates a fitness plan', async () => {
    const { result } = renderHook(() => useActivatePlan(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { planTemplateId: 'test-plan-id' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('plan');
  });

  it('handles activation error', async () => {
    server.use(
      http.post('http://*/api/fitness-plan/activate', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useActivatePlan(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: { planTemplateId: 'test-plan-id' },
      })
    ).rejects.toThrow();
  });
});

describe('useAdjustPlan', () => {
  it('adjusts plan based on feedback', async () => {
    const { result } = renderHook(() => useAdjustPlan(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: {
        feedback: 'Too hard',
        adjustments: ['reduce_intensity'],
      },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('plan');
  });

  it('handles adjustment error', async () => {
    server.use(
      http.post('http://*/api/fitness-plan/adjust', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useAdjustPlan(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: {
          feedback: 'Too hard',
          adjustments: [],
        },
      })
    ).rejects.toThrow();
  });
});

describe('usePausePlan', () => {
  it('pauses active plan', async () => {
    const { result } = renderHook(() => usePausePlan(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { planId: 'test-id', reason: 'vacation' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('pausedAt');
  });

  it('handles pause error', async () => {
    server.use(
      http.post('http://*/api/fitness-plan/pause', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => usePausePlan(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: { planId: 'test-id', reason: 'vacation' },
      })
    ).rejects.toThrow();
  });
});
