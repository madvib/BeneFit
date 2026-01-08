import type { Meta, StoryObj } from '@storybook/react';
import ExploreView from './explore-view';

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'City Marathon 2025',
    date: 'Oct 15, 2025',
    location: 'Central Park, NY',
    attendees: 1240,
    image: '🏃',
    category: 'Running',
  },
  {
    id: '2',
    title: 'Yoga in the Park',
    date: 'Tomorrow, 8:00 AM',
    location: 'Hyde Park',
    attendees: 45,
    image: '🧘',
    category: 'Yoga',
  },
];

const MOCK_TEAMS = [
  { id: '1', name: 'Early Birds', members: 120, category: 'General Fitness' },
  { id: '2', name: 'Iron Lifters', members: 85, category: 'Strength' },
];

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
