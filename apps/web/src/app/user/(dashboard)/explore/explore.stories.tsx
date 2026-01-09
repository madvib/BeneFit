import type { Meta, StoryObj } from '@storybook/react';
import ExploreView from './explore-view';
import { mockEvents, mockTeams } from '@/lib/testing/fixtures';

const MOCK_EVENTS = mockEvents;

const MOCK_TEAMS = mockTeams;

const meta: Meta = {
  title: 'Pages/Dashboard/Explore',
  component: ExploreView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: StoryObj<typeof ExploreView> = {
  render: () => <ExploreView events={MOCK_EVENTS} featuredTeams={MOCK_TEAMS} />,
};

export const Empty: StoryObj<typeof ExploreView> = {
  render: () => <ExploreView events={[]} featuredTeams={[]} />,
};
