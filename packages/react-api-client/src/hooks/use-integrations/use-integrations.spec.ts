import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useConnectedServices, useSync } from './use-integrations';
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

describe('use-integrations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useConnectedServices', () => {
    it('fetches and returns connected services', async () => {
      const mockResponse = {
        data: [
          { serviceType: 'strava', lastSyncAt: new Date().toISOString() }
        ],
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useConnectedServices(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useSync', () => {
    it('triggers an integration sync', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          workoutsSyncedCount: 5,
        },
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSync(), { wrapper });

      result.current.mutate({ json: { serviceType: 'strava' } });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse);
    });
  });
});
