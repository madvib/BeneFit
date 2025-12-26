'use client';

import { integrations } from '@bene/react-api-client';
import { useCallback } from 'react';

interface UseConnectionsControllerResult {
  services: any[];
  loading: boolean;
  error: Error | null;
  fetchServices: () => Promise<void>;
  handleConnect: (id: string) => Promise<void>;
  handleDisconnect: (id: string) => Promise<void>;
}

export function useConnectionsController(): UseConnectionsControllerResult {
  // React Query hooks from api-client
  const connectedServicesQuery = integrations.useConnectedServices();
  const connectMutation = integrations.useConnect();
  const disconnectMutation = integrations.useDisconnect();

  const fetchServices = useCallback(async () => {
    if (connectedServicesQuery.error) {
      await connectedServicesQuery.refetch();
    }
  }, [connectedServicesQuery]);

  const handleConnect = useCallback(async (serviceId: string) => {
    try {
      // Using a dummy service type and auth code since we don't have this context here
      await connectMutation.mutateAsync({
        serviceType: 'strava', // Default to strava, should be determined by actual service
        authorizationCode: '', // This would come from OAuth flow
        redirectUri: '' // This would come from OAuth flow
      });
    } catch (error) {
      throw error;
    }
  }, [connectMutation]);

  const handleDisconnect = useCallback(async (id: string) => {
    try {
      await disconnectMutation.mutateAsync({ json: { serviceId: id } });
    } catch (error) {
      throw error;
    }
  }, [disconnectMutation]);

  // Consolidated loading state
  const loading = connectedServicesQuery.isLoading ||
    connectMutation.isPending ||
    disconnectMutation.isPending;

  // Consolidated error
  const error = connectedServicesQuery.error ||
    connectMutation.error ||
    disconnectMutation.error;

  return {
    services: connectedServicesQuery.data || [],
    loading,
    error: error as Error | null,
    fetchServices,
    handleConnect,
    handleDisconnect,
  };
}