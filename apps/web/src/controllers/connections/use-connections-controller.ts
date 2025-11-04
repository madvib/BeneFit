'use client';

import { useState, useEffect } from 'react';
import { getServices, connectService, disconnectService, type ServiceConnectionData } from '@/controllers/connections';

interface UseConnectionsControllerResult {
  services: ServiceConnectionData[];
  loading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  handleConnect: (id: string) => Promise<void>;
  handleDisconnect: (id: string) => Promise<void>;
}

export function useConnectionsController(): UseConnectionsControllerResult {
  const [services, setServices] = useState<ServiceConnectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getServices();

      if (result.success && result.data) {
        setServices(result.data);
      } else {
        setError(result.error || 'Failed to fetch services');
      }
    } catch (err) {
      setError('Failed to load services data');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (id: string) => {
    setError(null);
    try {
      const result = await connectService({ serviceId: id });

      if (result.success) {
        // Update the service in the local state to reflect the connection
        setServices(prevServices => 
          prevServices.map(service => 
            service.id === id ? { ...service, connected: true } : service
          )
        );
      } else {
        setError(result.error || 'Failed to connect service');
      }
    } catch (err) {
      setError('Failed to connect service');
      console.error('Error connecting service:', err);
    }
  };

  const handleDisconnect = async (id: string) => {
    setError(null);
    try {
      const result = await disconnectService({ serviceId: id });

      if (result.success) {
        // Update the service in the local state to reflect the disconnection
        setServices(prevServices => 
          prevServices.map(service => 
            service.id === id ? { ...service, connected: false } : service
          )
        );
      } else {
        setError(result.error || 'Failed to disconnect service');
      }
    } catch (err) {
      setError('Failed to disconnect service');
      console.error('Error disconnecting service:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    handleConnect,
    handleDisconnect,
  };
}