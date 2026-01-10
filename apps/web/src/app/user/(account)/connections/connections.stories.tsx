import type { Meta, StoryObj } from '@storybook/react';
import ConnectionsView from './connections-view';

import { mockConnectedServices } from '@/lib/testing/fixtures';

const MOCK_CONNECTED = mockConnectedServices.services;

const meta: Meta = {
  title: 'Features/Account/Connections',
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
      connectedServices={MOCK_CONNECTED}
      onDisconnect={async () => {}}
      onSync={async () => {}}
      syncingServiceId={null}
    />
  ),
};

export const Syncing: StoryObj<typeof ConnectionsView> = {
  render: () => (
    <ConnectionsView
      connectedServices={MOCK_CONNECTED}
      onDisconnect={async () => {}}
      onSync={async () => {}}
      syncingServiceId="1"
    />
  ),
};
