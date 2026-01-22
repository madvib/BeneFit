import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useConnectedServices,
  useConnect,
  useDisconnect,
  useSync,
} from '../use-integrations';
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

describe('useConnectedServices', () => {
  it('fetches connected services successfully', async () => {
    const { result } = renderHook(() => useConnectedServices(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveProperty('services');
    expect(Array.isArray(result.current.data?.services)).toBe(true);
  });
});

describe('useConnect', () => {
  it('connects a service successfully', async () => {
    const { result } = renderHook(() => useConnect(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      json: {
        serviceType: 'strava',
        authCode: 'test-auth-code',
      },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('id');
  });
});

describe('useDisconnect', () => {
  it('disconnects a service successfully', async () => {
    const { result } = renderHook(() => useDisconnect(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      json: { serviceId: 'test-service-id' },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('id');
  });
});

describe('useSync', () => {
  it('syncs service data successfully', async () => {
    const { result } = renderHook(() => useSync(), {
      wrapper: createWrapper(),
    });

    const response = await result.current.mutateAsync({
      json: { serviceId: 'test-service-id' },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('success');
  });
});
