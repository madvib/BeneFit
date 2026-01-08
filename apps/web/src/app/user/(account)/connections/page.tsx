'use client';

import { useState } from 'react';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { integrations } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';
import ConnectionsView from './connections-view';

export default function ConnectionsClient() {
  const [syncingServiceId, setSyncingServiceId] = useState<string | null>(null);

  const connectedServicesQuery = integrations.useConnectedServices();
  const disconnectMutation = integrations.useDisconnect();
  const syncMutation = integrations.useSync();

  const loading = connectedServicesQuery.isLoading || disconnectMutation.isPending;
  const error = connectedServicesQuery.error || disconnectMutation.error;
  const services = connectedServicesQuery.data;

  const handleDisconnect = async (id: string) => {
    await disconnectMutation.mutateAsync({
      json: { serviceId: id },
    });
  };

  const handleSync = async (serviceId: string) => {
    try {
      setSyncingServiceId(serviceId);
      await syncMutation.mutateAsync({
        json: { serviceId },
      });
      // Invalidate connected services to show new sync time
      await connectedServicesQuery.refetch();
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncingServiceId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading connections..." variant="screen" />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Connections Loading Error"
        message="Unable to load your connected services."
        error={error}
        backHref={ROUTES.HOME}
      />
    );
  }

  const servicesList = services?.services || [];
  const connectedServices = servicesList.filter(
    (service: integrations.ConnectedService) => service.isActive,
  );

  return (
    <ConnectionsView
      connectedServices={connectedServices}
      onDisconnect={handleDisconnect}
      onSync={handleSync}
      syncingServiceId={syncingServiceId}
    />
  );
}
