'use client';

import { Button, Card, DateDisplay, GarminLogo, StravaLogo, typography } from '@/lib/components';
import { integrations } from '@bene/react-api-client';
import { CheckCircle2, RefreshCw, X, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: integrations.ConnectedService;
  onDisconnect: (_id: string) => void;
  onSync: (_id: string) => void;
  isSyncing: boolean;
}

const ServiceIcon = ({ type }: { type: string }) => {
  if (type === 'strava') return <StravaLogo />;
  if (type === 'garmin') return <GarminLogo />;
  return (
    <div
      className={`${typography.displayMd} bg-primary/10 text-primary flex h-full w-full items-center justify-center rounded-lg text-lg`}
    >
      {type.charAt(0).toUpperCase()}
    </div>
  );
};

export default function ServiceCard({
  service,
  onDisconnect,
  onSync,
  isSyncing,
}: ServiceCardProps) {
  const isConnected = service.isActive;

  const handleDisconnect = () => onDisconnect(service.id);
  const handleSync = () => onSync(service.id);

  return (
    <Card className="rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
            <ServiceIcon type={service.serviceType} />
            {isConnected && (
              <div className="absolute right-1 bottom-1 rounded-full bg-green-500 p-0.5 ring-2 ring-white dark:ring-gray-900">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <h4 className={`${typography.h4} text-lg capitalize`}>{service.serviceType}</h4>
            <p className={`${typography.p} text-muted-foreground text-sm`}>
              {isConnected ? (
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Connected
                </span>
              ) : (
                'Connect your account'
              )}
            </p>
          </div>
        </div>

        {service.lastSyncAt && (
          <div className="text-right">
            <p className={`${typography.mutedXs} text-muted-foreground`}>Last Synced</p>
            <p className={`${typography.xs} font-medium`}>
              <DateDisplay 
                date={service.lastSyncAt} 
                options={{ month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }}
              />
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        {isConnected ? (
          <div className="flex gap-3">
            <Button
              variant="soft"
              size="sm"
              className="flex-1 gap-2"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              Sync Data
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleDisconnect}
            >
              <span className="sr-only">Disconnect</span>
              <X size={18} />
            </Button>
          </div>
        ) : (
          <Button className={`${typography.p} btn-gradient w-full gap-2 text-base`} size="sm">
            Connect {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)}
            <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </Card>
  );
}
