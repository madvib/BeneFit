'use client';

import { useState } from 'react';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import Alert from '@/lib/components/ui-primitives/alert/alert';
import { integrations } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';
import ConnectionsView from './connections-view';

export default function ConnectionsClient() {
  const [syncingServiceId, setSyncingServiceId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<Error | null>(null);

  const connectedServicesQuery = integrations.useConnectedServices();
  const disconnectMutation = integrations.useDisconnect();
  const syncMutation = integrations.useSync();

  const handleDisconnect = async (id: string) => {
    try {
      setMutationError(null);
      await disconnectMutation.mutateAsync({
        json: { serviceId: id },
      });
    } catch (err) {
      setMutationError(err instanceof Error ? err : new Error('Failed to disconnect service'));
    }
  };

  const handleSync = async (serviceId: string) => {
    try {
      setMutationError(null);
      setSyncingServiceId(serviceId);
      await syncMutation.mutateAsync({
        json: { serviceId },
      });
      // Invalidate connected services to show new sync time
      await connectedServicesQuery.refetch();
    } catch (err) {
      console.error('Sync failed', err);
      setMutationError(err instanceof Error ? err : new Error('Failed to sync service'));
    } finally {
      setSyncingServiceId(null);
    }
  };

  if (connectedServicesQuery.isLoading) {
    return <LoadingSpinner text="Loading connections..." variant="screen" />;
  }

  if (connectedServicesQuery.error) {
    return (
      <ErrorPage
        title="Connections Loading Error"
        message="Unable to load your connected services."
        error={connectedServicesQuery.error}
        backHref={ROUTES.HOME}
      />
    );
  }

  const servicesList = connectedServicesQuery.data?.services || [];
  const connectedServices = servicesList.filter(
    (service: integrations.ConnectedService) => service.isActive,
  );

  return (
    <div className="space-y-4">
      {mutationError && (
        <Alert
          type="error"
          title="Action Failed"
          description={mutationError.message}
          onClose={() => setMutationError(null)}
          className="mb-4"
        />
      )}
      <ConnectionsView
        connectedServices={connectedServices}
        onDisconnect={handleDisconnect}
        onSync={handleSync}
        syncingServiceId={syncingServiceId}
      />
      {disconnectMutation.isPending && (
        <LoadingSpinner text="Disconnecting..." variant="overlay" />
      )}
    </div>
  );
}
