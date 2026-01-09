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
          serviceType: 'strava',
          isActive: true,
          isPaused: false,
          lastSyncAt: new Date().toISOString(),
          syncStatus: 'success',
        }}
      />
      <ServiceCard
        {...args}
        service={{
          id: '2',
          serviceType: 'garmin',
          isActive: false, // Disconnected
          isPaused: false,
          // lastSyncAt intentionally undefined
          syncStatus: 'idle',
        }}
      />
    </div>
  ),
};

export const StravaConnected: Story = {
  args: {
    service: {
      id: '1',
      serviceType: 'strava',
      isActive: true,
      isPaused: false,
      lastSyncAt: new Date().toISOString(),
      syncStatus: 'success',
    },
  },
};

export const StravaSyncing: Story = {
  args: {
    isSyncing: true,
    service: {
      id: '1',
      serviceType: 'strava',
      isActive: true,
      isPaused: false,
      lastSyncAt: new Date().toISOString(),
      syncStatus: 'in_progress',
    },
  },
};

export const GarminAvailable: Story = {
  args: {
    service: {
      id: '2',
      serviceType: 'garmin',
      isActive: false,
      isPaused: false,
      syncStatus: 'idle',
    },
  },
};
