'use client';

import { Button, Card } from '@/lib/components';
import { integrations } from '@bene/react-api-client';

interface ServiceCardProps {
  service: integrations.ConnectedService;
  onDisconnect: (_id: string) => void;
  onSync: (_id: string) => void;
  isSyncing: boolean;
}

export default function ServiceCard({
  service,
  onDisconnect,
  onSync,
  isSyncing,
}: ServiceCardProps) {
  const handleDisconnect = () => {
    onDisconnect(service.id);
  };

  const handleSync = () => {
    onSync(service.id);
  };

  const connectionString = service.isActive ? 'Connected' : 'Not connected';

  return (
    <Card>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 rounded-lg bg-white p-2 dark:bg-gray-800">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg font-bold">
                {service.serviceType.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h4 className="font-semibold capitalize">{service.serviceType}</h4>
              <p className="text-muted-foreground text-sm">
                {service.lastSyncAt
                  ? `Synced: ${new Date(service.lastSyncAt).toLocaleDateString()}`
                  : connectionString}
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 text-sm">
          Status: <span className="font-medium">{service.syncStatus}</span>
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          <span
            className={`rounded px-2 py-1 text-xs ${
              service.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {service.isActive ? 'Active' : 'Available'}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleSync} isLoading={isSyncing}>
            Sync Now
          </Button>
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 dark:hover:text-red-400"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      </div>
    </Card>
  );
}
