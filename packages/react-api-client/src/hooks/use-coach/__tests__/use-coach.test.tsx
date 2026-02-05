// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { http, HttpResponse } from 'msw';
import { server } from '../../../test/setup.js';
import { buildGetCoachHistoryResponse } from '../../../fixtures/coach.js';
import { toHttpResponse } from '../../../test/msw/utils.js';
import { useCoachHistory, useSendMessage } from '../use-coach.js';

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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useCoachHistory', () => {
  it('fetches coach history successfully', async () => {
    // Uses default MSW handler
    const { result } = renderHook(() => useCoachHistory(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for success
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify data structure
    expect(result.current.data).toHaveProperty('messages');
    expect(result.current.data).toHaveProperty('pendingCheckIns');
    expect(result.current.data).toHaveProperty('stats');
    expect(Array.isArray(result.current.data?.messages)).toBe(true);
  });

  it('handles empty history', async () => {
    // Override default handler with custom response
    server.use(
      http.get('http://*/api/coach/history', () => {
        return HttpResponse.json({
          messages: [],
          pendingCheckIns: [],
          stats: { totalMessages: 0, totalCheckIns: 0, actionsApplied: 0 },
        });
      }),
    );

    const { result } = renderHook(() => useCoachHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.messages).toHaveLength(0);
    expect(result.current.data?.pendingCheckIns).toHaveLength(0);
  });

  it('handles server error', async () => {
    // Override with error response
    server.use(
      http.get('http://*/api/coach/history', () => {
        return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useCoachHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });

  it('uses seed for reproducible data', async () => {
    // Use fixture builder with seed for deterministic test
    const mockData = buildGetCoachHistoryResponse({ seed: 42 });

    server.use(
      http.get('http://*/api/coach/history', () => {
        return toHttpResponse(mockData);
      }),
    );

    const { result } = renderHook(() => useCoachHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Data matches seeded fixture exactly
    expect(result.current.data).toEqual(JSON.parse(JSON.stringify(mockData.value)));
  });
});

describe('useSendMessage', () => {
  it('sends message successfully', async () => {
    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    // Send message
    const promise = result.current.mutateAsync({
      json: { message: 'Hello, coach!' },
    });

    // Should be pending
    await waitFor(() => expect(result.current.isPending).toBe(true));

    // Wait for success
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('coachResponse');
    expect(response.coachResponse).toContain('Hello, coach!');
  });

  it('handles send failure', async () => {
    // Override with error
    server.use(
      http.post('http://localhost:8787/api/coach/message', () => {
        return HttpResponse.json({ error: 'Failed to send message' }, { status: 400 });
      }),
    );

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createWrapper(),
    });

    // Attempt to send
    await expect(
      result.current.mutateAsync({
        json: { message: 'This will fail' },
      }),
    ).rejects.toThrow();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

import {
  useDismissCheckIn,
  useRespondToCheckIn,
  useTriggerProactiveCheckIn,
  useGenerateWeeklySummary,
} from '../use-coach.js';

describe('useDismissCheckIn', () => {
  it('dismisses check-in successfully', async () => {
    const { result } = renderHook(() => useDismissCheckIn(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    const promise = result.current.mutateAsync({
      json: { checkInId: 'check-in-123' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const response = await promise;
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });

  it('handles dismiss failure', async () => {
    server.use(
      http.post('http://*/api/coach/check-in/dismiss', () => {
        return HttpResponse.json({ error: 'Failed to dismiss check-in' }, { status: 400 });
      }),
    );

    const { result } = renderHook(() => useDismissCheckIn(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: { checkInId: 'check-in-123' },
      }),
    ).rejects.toThrow();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useRespondToCheckIn', () => {
  it('responds to check-in successfully', async () => {
    const { result } = renderHook(() => useRespondToCheckIn(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: {
        checkInId: 'check-in-123',
        response: 'I feel great',
      },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const response = await promise;
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });

  it('handles response failure', async () => {
    server.use(
      http.post('http://*/api/coach/check-in/respond', () => {
        return HttpResponse.json({ error: 'Failed to respond to check-in' }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useRespondToCheckIn(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: {
          checkInId: 'check-in-123',
          response: 'Error case',
        },
      }),
    ).rejects.toThrow();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useTriggerProactiveCheckIn', () => {
  it('triggers check-in successfully', async () => {
    const { result } = renderHook(() => useTriggerProactiveCheckIn(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { reason: 'manual_test' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const response = await promise;
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toBeDefined();
  });
});

describe('useGenerateWeeklySummary', () => {
  it('generates summary successfully', async () => {
    const { result } = renderHook(() => useGenerateWeeklySummary(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: {
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    const response = await promise;
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // Based on fixture, it should have a summary field or similar
    expect(response).toBeDefined();
  });
});
