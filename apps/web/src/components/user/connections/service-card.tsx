'use client';

import { Button, Card } from '@/components';
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
  onConnect: (_id: string) => void;
  onDisconnect: (_id: string) => void;
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
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-4 rounded-lg bg-white p-2 dark:bg-gray-800">
            <Image
              src={service.logo}
              alt={service.name}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h4 className="font-semibold">{service.name}</h4>
            <p className="text-muted-foreground text-sm">
              {service.lastSync
                ? `Last sync: ${new Date(service.lastSync).toLocaleDateString()}`
                : connectionString}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>

        <div className="mb-4">
          <h5 className="mb-2 text-sm font-medium">
            {service.connected ? 'Data Synced:' : 'Data Available:'}
          </h5>
          <div className="flex flex-wrap gap-2">
            {service.dataType.map((type, index) => (
              <span
                key={index}
                className={`rounded px-2 py-1 text-xs ${
                  service.connected
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {service.connected ? (
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 dark:hover:text-red-400"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        ) : (
          <Button variant="default" className="w-full" onClick={handleConnect}>
            Connect
          </Button>
        )}
      </div>
    </Card>
  );
}
