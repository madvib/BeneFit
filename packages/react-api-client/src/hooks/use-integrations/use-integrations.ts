import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { getApiClient } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

// Query keys factory
export const integrationKeys = {
  all: ['integrations'] as const,
  connected: (userId: string) => [...integrationKeys.all, userId, 'connected'] as const,
} as const;

// Based on actual routes from gateway/src/routes/integrations.ts
// Routes: POST /connect, POST /disconnect, GET /connected, POST /sync

// Lazy getters for API endpoints - only called when hooks are used
const get$getConnectedServices = () => getApiClient().api.integrations.connected.$get;
export type GetConnectedServicesResponse = ApiSuccessResponse<
  ReturnType<typeof get$getConnectedServices>
>;

export function useConnectedServices() {
  return useQuery<GetConnectedServicesResponse>({
    queryKey: ['integrations', 'connected'], // No userId needed since it's injected from auth
    queryFn: () => fetchApi(get$getConnectedServices()),
  });
}

const get$connect = () => getApiClient().api.integrations.connect.$post;
export type ConnectRequest = InferRequestType<ReturnType<typeof get$connect>>;

export function useConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ConnectRequest) => fetchApi(get$connect(), request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      queryClient.invalidateQueries({ queryKey: ['integrations', 'connected'] });
    },
  });
}

const get$disconnect = () => getApiClient().api.integrations.disconnect.$post;
export type DisconnectRequest = InferRequestType<ReturnType<typeof get$disconnect>>;

export function useDisconnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DisconnectRequest) => fetchApi(get$disconnect(), request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      queryClient.invalidateQueries({ queryKey: ['integrations', 'connected'] });
    },
  });
}

const get$sync = () => getApiClient().api.integrations.sync.$post;
export type SyncRequest = InferRequestType<ReturnType<typeof get$sync>>;

export function useSync() {
  return useMutation({
    mutationFn: (request: SyncRequest) => fetchApi(get$sync(), request),
  });
}
