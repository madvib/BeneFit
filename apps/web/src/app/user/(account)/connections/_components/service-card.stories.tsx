import type { Meta, StoryObj } from '@storybook/react';
import ServiceCard from './service-card';

const meta: Meta<typeof ServiceCard> = {
  title: 'Pages/Account/Connections/ServiceCard',
  component: ServiceCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    isSyncing: false,
    onDisconnect: () => console.log('Disconnect clicked'),
    onSync: () => console.log('Sync clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof ServiceCard>;

export const GridExample: Story = {
  name: 'Services Grid',
  render: (args) => (
    <div className="grid max-w-4xl gap-6 md:grid-cols-2">
      <ServiceCard
        {...args}
        service={{
          id: '1',
          userId: 'user1',
          serviceType: 'strava',
          accessToken: 'token',
          refreshToken: 'refresh',
          expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
          isActive: true, // Connected
          syncStatus: 'idle',
          lastSyncAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
      />
      <ServiceCard
        {...args}
        service={{
          id: '2',
          userId: 'user1',
          serviceType: 'garmin',
          accessToken: 'token',
          refreshToken: 'refresh',
          expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
          isActive: false, // Disconnected
          syncStatus: 'idle',
          lastSyncAt: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
      />
    </div>
  ),
};

export const StravaConnected: Story = {
  args: {
    service: {
      id: '1',
      userId: 'user1',
      serviceType: 'strava',
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
      isActive: true,
      syncStatus: 'idle',
      lastSyncAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

export const StravaSyncing: Story = {
  args: {
    isSyncing: true,
    service: {
      id: '1',
      userId: 'user1',
      serviceType: 'strava',
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
      isActive: true,
      syncStatus: 'syncing',
      lastSyncAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};

export const GarminAvailable: Story = {
  args: {
    service: {
      id: '2',
      userId: 'user1',
      serviceType: 'garmin',
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
      isActive: false,
      syncStatus: 'idle',
      lastSyncAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};
