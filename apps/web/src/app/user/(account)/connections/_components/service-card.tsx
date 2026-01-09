'use client';

import { Button } from '@/lib/components';
import { integrations } from '@bene/react-api-client';
import { CheckCircle2, RefreshCw, X, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: integrations.ConnectedService;
  onDisconnect: (_id: string) => void;
  onSync: (_id: string) => void;
  isSyncing: boolean;
}

import { StravaLogo, GarminLogo } from '@/lib/components';

const ServiceIcon = ({ type }: { type: string }) => {
  if (type === 'strava') return <StravaLogo />;
  if (type === 'garmin') return <GarminLogo />;
  return (
    <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center rounded-lg font-bold">
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
  // Format sync time without Date.now() to avoid impure function call
  const formattedSyncTime = service.lastSyncAt
    ? new Date(service.lastSyncAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    : null;
  return (
    <div className="group bg-card text-card-foreground relative overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md">
      {/* Spotlight Effect */}
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      </div>

      <div className="relative p-6">
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
              <h4 className="text-lg font-semibold capitalize">{service.serviceType}</h4>
              <p className="text-muted-foreground text-sm">
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

          {formattedSyncTime && (
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Last Synced</p>
              <p className="text-xs font-medium">{formattedSyncTime}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          {isConnected ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary/5 hover:text-primary hover:border-primary/20 flex-1 gap-2"
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
            <Button className="btn-gradient w-full gap-2 text-base" size="sm">
              Connect {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)}
              <ArrowRight size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
