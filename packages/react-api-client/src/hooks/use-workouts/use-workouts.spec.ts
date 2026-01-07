import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useTodaysWorkout, useUpcomingWorkouts } from './use-workouts';
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

describe('use-workouts hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useTodaysWorkout', () => {
    it('fetches and returns today\'s workout', async () => {
      const mockData = {
        data: {
          id: 'workout_1',
          name: 'Morning Run',
          type: 'cardio',
          status: 'scheduled',
          scheduledAt: new Date().toISOString(),
          activities: [],
        },
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockData);

      const { result } = renderHook(() => useTodaysWorkout(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
      expect(fetchApi).toHaveBeenCalled();
    });

    it('handles no workout today', async () => {
      const mockData = {
        data: null,
        message: 'No workout scheduled for today',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockData);

      const { result } = renderHook(() => useTodaysWorkout(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.data).toBeNull();
    });
  });

  describe('useUpcomingWorkouts', () => {
    it('fetches upcoming workouts with parameters', async () => {
      const mockData = {
        data: [
          { id: 'workout_2', name: 'Leg Day', type: 'strength' }
        ],
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockData);

      const { result } = renderHook(() => useUpcomingWorkouts({ query: { limit: 5 } }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
      expect(fetchApi).toHaveBeenCalledWith(expect.anything(), { query: { limit: 5 } });
    });
  });
});
