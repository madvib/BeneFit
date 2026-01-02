'use client';

import { LoadingSpinner, ErrorPage } from '@/lib';
import { ServiceCard } from '@/app/user/(account)/connections/#components';
import { integrations } from '@bene/react-api-client';
import { PageHeader } from '@/app/user/(account)/#shared/page-header';
import { ROUTES } from '@/lib/constants';

export default function ConnectionsClient() {
  const connectedServicesQuery = integrations.useConnectedServices();
  const connectMutation = integrations.useConnect();
  const disconnectMutation = integrations.useDisconnect();

  const loading =
    connectedServicesQuery.isLoading || connectMutation.isPending || disconnectMutation.isPending;
  const error = connectedServicesQuery.error || connectMutation.error || disconnectMutation.error;
  const services = connectedServicesQuery.data || [];

  const handleConnect = async (id: string) => {
    // Note: Defaulting to 'strava' as a placeholder for the service type
    await connectMutation.mutateAsync({
      json: {
        serviceType: 'strava',
        authorizationCode: '',
        redirectUri: '',
      },
    });
  };

  const handleDisconnect = async (id: string) => {
    await disconnectMutation.mutateAsync({
      json: { serviceId: id },
    });
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

  const connectedServices = services.filter((service) => service.connected);
  const availableServices = services.filter((service) => !service.connected);

  const serviceCards = (services: any[]) => {
    return services.map((service) => (
      <ServiceCard
        key={service.id}
        service={service}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connections"
        description="Manage your connected services and integrations"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Connected Services - Left Column (Larger) */}
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-xl font-semibold">Connected Services</h3>
          <div className="flex flex-col gap-4">
            {connectedServices.length > 0 ? (
              serviceCards(connectedServices)
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                No services connected yet
              </div>
            )}
          </div>
        </div>

        {/* Available Services - Right Column (Smaller, Scrollable) */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xl font-semibold">Available Services</h3>
          <div className="lg:scrollbar-thin lg:scrollbar-thumb-muted lg:scrollbar-track-transparent lg:h-[600px] lg:overflow-y-auto lg:pr-2">
            <div className="flex flex-col gap-4">
              {availableServices.length > 0 ? (
                serviceCards(availableServices)
              ) : (
                <div className="text-muted-foreground col-span-full py-8 text-center">
                  All available services are connected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
