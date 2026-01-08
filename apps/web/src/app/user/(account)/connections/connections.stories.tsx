import type { Meta, StoryObj } from '@storybook/react';
import ConnectionsView from './connections-view';

const MOCK_CONNECTED = [
  {
    id: '1',
    serviceType: 'strava',
    displayName: 'Strava',
    isActive: true,
    lastSyncAt: new Date().toISOString(),
    config: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const meta: Meta = {
  title: 'Pages/Account/Connections',
  component: ConnectionsView,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Disconnected: StoryObj<typeof ConnectionsView> = {
  render: () => (
    <ConnectionsView
      connectedServices={[]}
      onDisconnect={async () => {}}
      onSync={async () => {}}
      syncingServiceId={null}
    />
  ),
};

export const Connected: StoryObj<typeof ConnectionsView> = {
  render: () => (
    <ConnectionsView
      connectedServices={MOCK_CONNECTED as any} // Cast for mock type safety
      onDisconnect={async () => {}}
      onSync={async () => {}}
      syncingServiceId={null}
    />
  ),
};

export const Syncing: StoryObj<typeof ConnectionsView> = {
  render: () => (
    <ConnectionsView
      connectedServices={MOCK_CONNECTED as any}
      onDisconnect={async () => {}}
      onSync={async () => {}}
      syncingServiceId="1"
    />
  ),
};
