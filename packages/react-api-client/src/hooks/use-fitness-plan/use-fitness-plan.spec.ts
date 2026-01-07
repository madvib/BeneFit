import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useActivePlan } from './use-fitness-plan';
import { fetchApi } from '../../lib/api-client';

vi.mock('../../lib/api-client', async () => {
  const actual = await vi.importActual('../../lib/api-client');
  return {
    ...actual,
    fetchApi: vi.fn(),
  };
});

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useActivePlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns the active plan', async () => {
    const mockData = {
      hasPlan: true,
      plan: {
        id: 'plan_1',
        title: 'Mock Plan',
        status: 'active',
        summary: { completed: 2, total: 4 },
        currentWeek: 1,
        durationWeeks: 4,
        weeks: [],
      },
      message: 'Success',
    };

    (vi.mocked(fetchApi) as any).mockResolvedValue(mockData);

    const { result } = renderHook(() => useActivePlan(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetchApi).toHaveBeenCalled();
  });

  it('handles "no plan" state correctly', async () => {
    const mockData = {
      hasPlan: false,
      plan: null,
      message: 'No active plan found',
    };

    (vi.mocked(fetchApi) as any).mockResolvedValue(mockData);

    const { result } = renderHook(() => useActivePlan(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.hasPlan).toBe(false);
    expect(result.current.data?.plan).toBeNull();
  });
});
