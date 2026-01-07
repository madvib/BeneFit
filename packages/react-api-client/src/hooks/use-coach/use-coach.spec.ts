import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useSendMessage, useTriggerProactiveCheckIn } from './use-coach';
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

describe('use-coach hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSendMessage', () => {
    it('sends a message to the coach', async () => {
      const mockResponse = {
        data: {
          id: 'msg_1',
          role: 'assistant',
          content: 'I can help with that.',
          createdAt: new Date().toISOString(),
        },
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSendMessage(), { wrapper });

      result.current.mutate({ json: { content: 'Help me' } });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse);
      expect(fetchApi).toHaveBeenCalledWith(expect.anything(), { json: { content: 'Help me' } });
    });
  });

  describe('useTriggerProactiveCheckIn', () => {
    it('triggers a proactive check-in', async () => {
      const mockResponse = {
        data: {
          question: 'How are you?',
          status: 'pending',
        },
        message: 'Success',
      };

      (vi.mocked(fetchApi) as any).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTriggerProactiveCheckIn(), { wrapper });

      result.current.mutate({ json: { triggerType: 'manual' } });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockResponse);
    });
  });
});
