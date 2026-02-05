// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../../test/setup.js';
import {
  useProfile,
  useCreateProfile,
  useUpdateGoals,
  useUpdatePreferences,
  useUserStats,
  useUpdateConstraints,
} from '../use-profile.js';
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

describe('useProfile', () => {
  it('fetches user profile successfully', async () => {
    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('userId');
  });

  it('handles fetch error', async () => {
    server.use(
      http.get('http://*/api/profile', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useCreateProfile', () => {
  it('creates user profile successfully', async () => {
    const { result } = renderHook(() => useCreateProfile(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: {
        name: 'John Doe',
        email: 'john@example.com',
        // Minimal required fields
      } as any, 
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });

  it('handles creation error', async () => {
    server.use(
      http.post('http://*/api/profile', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useCreateProfile(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({ json: {} as any })
    ).rejects.toThrow();
  });
});

describe('useUpdateGoals', () => {
  it('updates goals successfully', async () => {
    const { result } = renderHook(() => useUpdateGoals(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { fitnessGoals: { primaryGoal: 'muscle_gain' } as any },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });
});

describe('useUpdatePreferences', () => {
  it('updates preferences successfully', async () => {
    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { preferences: { theme: 'dark' } as any },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });
});

describe('useUserStats', () => {
  it('fetches user stats successfully', async () => {
    const { result } = renderHook(() => useUserStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useUpdateConstraints', () => {
  it('updates constraints successfully', async () => {
    const { result } = renderHook(() => useUpdateConstraints(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { constraints: [] as any },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });
});
