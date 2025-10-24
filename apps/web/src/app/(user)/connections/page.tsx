"use client";

import { PageContainer } from "@/presentation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getServices } from "@/infrastructure/data/mock-data-service";
import { ServiceConnection } from "@/infrastructure/data/types/data-types";

export default function ConnectionsPage() {
  const [services, setServices] = useState<ServiceConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleConnect = (id: number) => {
    // In a real app, this would initiate OAuth flow
    console.log(`Connecting to service with id: ${id}`);
    alert(`Connecting to service ${services.find((s) => s.id === id)?.name}`);
  };

  const handleDisconnect = (id: number) => {
    // In a real app, this would disconnect the service
    console.log(`Disconnecting service with id: ${id}`);
    alert(`Disconnected from ${services.find((s) => s.id === id)?.name}`);
  };

  if (loading) {
    return (
      <PageContainer title="Service Connections">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Service Connections">
      <div className="bg-secondary p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Connected Services</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter((service) => service.connected)
              .map((service) => (
                <div
                  key={service.id}
                  className="bg-background p-6 rounded-lg shadow-sm border border-muted"
                >
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
                          ? `Last sync: ${service.lastSync}`
                          : "Connected"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Data Synced:</h5>
                    <div className="flex flex-wrap gap-2">
                      {service.dataType.map((type, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDisconnect(service.id)}
                    className="w-full btn btn-ghost text-red-600 hover:text-red-700 dark:hover:text-red-400"
                  >
                    Disconnect
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Available Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter((service) => !service.connected)
              .map((service) => (
                <div
                  key={service.id}
                  className="bg-background p-6 rounded-lg shadow-sm border border-muted"
                >
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
                        Not connected
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">
                      Data Available:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {service.dataType.map((type, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnect(service.id)}
                    className="w-full btn btn-primary"
                  >
                    Connect
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
