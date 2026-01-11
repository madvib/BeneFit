'use client';

import { integrations } from '@bene/react-api-client';
import { OAuthButton } from '@/lib/components/auth/oauth-button';
import { ServiceCard } from './_components';
import { PageHeader } from '@/lib/components';

// Available services that can be connected
// Exported for stories if needed, or kept internal
export const AVAILABLE_SERVICES = [
  {
    id: 'strava',
    serviceType: 'strava',
    displayName: 'Strava',
    description: 'Connect your Strava account to sync activities',
    icon: 'https://cdn.simpleicons.org/strava/FC4C02',
  },
] as const;

interface ConnectionsViewProps {
  connectedServices: integrations.ConnectedService[];
  onDisconnect: (_id: string) => Promise<void>;
  onSync: (_serviceId: string) => Promise<void>;
  syncingServiceId: string | null;
}

export default function ConnectionsView({
  connectedServices,
  onDisconnect,
  onSync,
  syncingServiceId,
}: ConnectionsViewProps) {
  // Filter available services to only show those not already connected
  const connectedServiceTypes = new Set(connectedServices.map((s) => s.serviceType));
  const availableServices = AVAILABLE_SERVICES.filter(
    (service) => !connectedServiceTypes.has(service.serviceType),
  );

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
              connectedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onDisconnect={onDisconnect}
                  onSync={onSync}
                  isSyncing={syncingServiceId === service.id}
                />
              ))
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                No services connected yet
              </div>
            )}
          </div>
        </div>

        {/* Available Services - Right Column (Smaller) */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xl font-semibold">Available Services</h3>
          <div className="flex flex-col gap-4">
            {availableServices.length > 0 ? (
              availableServices.map((service) => (
                <div
                  key={service.id}
                  className="border-border flex flex-col gap-4 rounded-lg border p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted rounded-full p-3">
                      <img src={service.icon} alt={service.displayName} className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{service.displayName}</h4>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </div>
                  </div>
                  <OAuthButton
                    provider={service.serviceType}
                    text={`Connect ${service.displayName}`}
                    mode="link"
                    callbackURL="/user/connections"
                  />
                </div>
              ))
            ) : (
              <div className="text-muted-foreground col-span-full py-8 text-center">
                All available services are connected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
