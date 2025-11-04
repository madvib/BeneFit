'use client';

import { PageContainer } from '@/components';
import { useConnectionsController } from '@/controllers/connections';
import ServiceCard from './service-card';

export default function ConnectionsClient() {
  const {
    services,
    loading,
    error,
    handleConnect,
    handleDisconnect
  } = useConnectionsController();

  if (loading) {
    return (
      <PageContainer title="Service Connections">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Service Connections">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </PageContainer>
    );
  }

  const connectedServices = services.filter(service => service.connected);
  const availableServices = services.filter(service => !service.connected);

  return (
    <PageContainer title="Service Connections">
      <div className="bg-secondary p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Connected Services</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedServices.length > 0 ? (
              connectedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No services connected yet
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServices.length > 0 ? (
              availableServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                All available services are connected
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}