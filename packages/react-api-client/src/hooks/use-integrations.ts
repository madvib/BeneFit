import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { client } from '../client';
import { fetchApi, type ApiSuccessResponse } from '../lib/api-client';

// Query keys factory
export const integrationKeys = {
  all: ['integrations'] as const,
  connected: (userId: string) => [...integrationKeys.all, userId, 'connected'] as const,
} as const;

// Based on actual routes from gateway/src/routes/integrations.ts
// Routes: POST /connect, POST /disconnect, GET /connected, POST /sync

const $getConnectedServices = client.api.integrations.connected.$get;
export type GetConnectedServicesResponse = ApiSuccessResponse<typeof $getConnectedServices>;

export function useConnectedServices() {
  return useQuery<GetConnectedServicesResponse>({
    queryKey: ['integrations', 'connected'], // No userId needed since it's injected from auth
    queryFn: () => fetchApi($getConnectedServices),
  });
}

const $connect = client.api.integrations.connect.$post;
export type ConnectRequest = InferRequestType<typeof $connect>;

export function useConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ConnectRequest) => fetchApi($connect, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      queryClient.invalidateQueries({ queryKey: ['integrations', 'connected'] });
    },
  });
}

const $disconnect = client.api.integrations.disconnect.$post;
export type DisconnectRequest = InferRequestType<typeof $disconnect>;

export function useDisconnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DisconnectRequest) => fetchApi($disconnect, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      queryClient.invalidateQueries({ queryKey: ['integrations', 'connected'] });
    },
  });
}

const $sync = client.api.integrations.sync.$post;
export type SyncRequest = InferRequestType<typeof $sync>;

export function useSync() {
  return useMutation({
    mutationFn: (request: SyncRequest) => fetchApi($sync, request),
  });
}