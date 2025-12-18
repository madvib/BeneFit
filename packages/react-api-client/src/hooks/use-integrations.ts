import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationClient } from '../client';

export function useConnectedServices(userId: string) {
  return useQuery({
    queryKey: ['integrations', userId],
    queryFn: async () => {
      const res = await integrationClient.connected.$get({
        query: { userId },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch connected integrations');
      }
      return await res.json();
    },
    enabled: !!userId,
  });
}

export function useConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      serviceType,
      authorizationCode,
      redirectUri,
    }: {
      userId: string;
      serviceType: string;
      authorizationCode: string;
      redirectUri: string;
    }) => {
      const res = await integrationClient.connect.$post({
        json: { userId, serviceType, authorizationCode, redirectUri },
      });
      if (!res.ok) {
        throw new Error('Failed to connect integration');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['integrations', userId] });
    },
  });
}

export function useDisconnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      serviceId,
    }: {
      userId: string;
      serviceId: string;
    }) => {
      const res = await integrationClient.disconnect.$post({
        json: { userId, serviceId },
      });
      if (!res.ok) {
        throw new Error('Failed to disconnect integration');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['integrations', userId] });
    },
  });
}

export function useSync() {
  return useMutation({
    mutationFn: async ({
      userId,
      serviceId,
    }: {
      userId: string;
      serviceId: string;
    }) => {
      const res = await integrationClient.sync.$post({
        json: { userId, serviceId },
      });
      if (!res.ok) {
        throw new Error('Failed to sync integration');
      }
      return await res.json();
    },
  });
}
