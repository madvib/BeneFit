import { integrations } from '@bene/react-api-client';

export const mockConnectedServices: integrations.GetConnectedServicesResponse = {
  services: [
    {
      id: 'service-1',
      serviceType: 'strava',
      isActive: true,
      isPaused: false,
      lastSyncAt: '2026-01-08T08:00:00Z',
      syncStatus: 'idle',
    },
    {
      id: 'service-2',
      serviceType: 'apple_health',
      isActive: false,
      isPaused: true,
      syncStatus: 'error',
    },
  ],
};
