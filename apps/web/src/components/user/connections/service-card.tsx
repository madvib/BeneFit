'use client';

import { Card } from '@/components';
import Image from 'next/image';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    connected: boolean;
    logo: string;
    dataType: string[];
    lastSync?: string;
  };
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export default function ServiceCard({
  service,
  onConnect,
  onDisconnect,
}: ServiceCardProps) {
  const handleConnect = () => {
    onConnect(service.id);
  };

  const handleDisconnect = () => {
    onDisconnect(service.id);
  };
  const connectionString = service.connected ? 'Connected' : 'Not connected';

  return (
    <Card>
      <div className="bg-background p-6 rounded-lg shadow-sm border border-muted">
        <div className="flex items-center mb-4">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-lg mr-4">
            <Image
              src={service.logo}
              alt={service.name}
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h4 className="font-semibold">{service.name}</h4>
            <p className="text-sm text-muted-foreground">
              {service.lastSync
                ? `Last sync: ${new Date(service.lastSync).toLocaleDateString()}`
                : connectionString}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

        <div className="mb-4">
          <h5 className="text-sm font-medium mb-2">
            {service.connected ? 'Data Synced:' : 'Data Available:'}
          </h5>
          <div className="flex flex-wrap gap-2">
            {service.dataType.map((type, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  service.connected
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {service.connected ? (
          <button
            onClick={handleDisconnect}
            className="w-full btn btn-ghost text-red-600 hover:text-red-700 dark:hover:text-red-400"
          >
            Disconnect
          </button>
        ) : (
          <button onClick={handleConnect} className="w-full btn btn-primary">
            Connect
          </button>
        )}
      </div>
    </Card>
  );
}
