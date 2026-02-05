// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../../test/setup.js';
import {
  useConnectedServices,
  useConnect,
  useDisconnect,
  useSync,
} from '../use-integrations.js';
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

  it('handles fetch error', async () => {
    server.use(
      http.get('http://*/api/integrations/connected', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useConnectedServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useConnect', () => {
  it('connects a service successfully', async () => {
    const { result } = renderHook(() => useConnect(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: {
        serviceType: 'strava',
        authCode: 'test-auth-code',
      },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('id');
  });

  it('handles connection error', async () => {
    server.use(
      http.post('http://*/api/integrations/connect', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useConnect(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: {
          serviceType: 'strava',
          authCode: 'invalid',
        },
      })
    ).rejects.toThrow();
  });
});

describe('useDisconnect', () => {
  it('disconnects a service successfully', async () => {
    const { result } = renderHook(() => useDisconnect(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { serviceId: 'test-service-id' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('id');
  });

  it('handles disconnection error', async () => {
    server.use(
      http.post('http://*/api/integrations/disconnect', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 400 });
      })
    );

    const { result } = renderHook(() => useDisconnect(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: { serviceId: 'test-service-id' },
      })
    ).rejects.toThrow();
  });
});

describe('useSync', () => {
  it('syncs service data successfully', async () => {
    const { result } = renderHook(() => useSync(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync({
      json: { serviceId: 'test-service-id' },
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));
    const response = await promise;

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(response).toHaveProperty('success');
  });

  it('handles sync error', async () => {
    server.use(
      http.post('http://*/api/integrations/sync', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useSync(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        json: { serviceId: 'test-service-id' },
      })
    ).rejects.toThrow();
  });
});
