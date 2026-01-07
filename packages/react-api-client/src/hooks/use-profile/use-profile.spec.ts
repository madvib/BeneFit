import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useProfile, useUserStats, useUpdateConstraints } from './use-profile';
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

describe('use-profile hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProfile', () => {
    it('fetches and returns the user profile', async () => {
      const mockResponse = {
        data: {
          userId: 'user_1',
          displayName: 'John Doe',
          bio: 'Athlete',
        },
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useUserStats', () => {
    it('fetches and returns user statistics', async () => {
      const mockResponse = {
        data: {
          currentStreakDays: 5,
          totalWorkoutsCompleted: 10,
        },
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUserStats(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useUpdateConstraints', () => {
    it('sends constraints update and invalidates profile query', async () => {
      const mockUpdate = {
        json: {
          availability: ['Mon', 'Wed', 'Fri'],
          maxHoursPerWeek: 5,
        },
      };
      const mockResponse = { data: { success: true }, message: 'Updated' };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateConstraints(), { wrapper });

      await result.current.mutateAsync(mockUpdate as any);

      expect(fetchApi).toHaveBeenCalledWith(expect.anything(), mockUpdate);
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
  });
});
