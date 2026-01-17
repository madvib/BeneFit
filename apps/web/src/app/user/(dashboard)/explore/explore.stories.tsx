import type { Meta, StoryObj } from '@storybook/react';
import ExploreView from './explore-view';
import { Carousel } from '@/lib/components';

// Events and Teams are UI-specific features not yet in API schemas
// Keep as local fixtures until we have proper API endpoints
const mockEvents = [
  {
    id: '1',
    title: 'Summer Fitness Challenge',
    description: 'Join us for a 30-day fitness challenge',
    date: '2026-07-01',
    participants: 150,
  },
  {
    id: '2',
    title: 'Marathon Training Group',
    description: 'Prepare for the upcoming city marathon',
    date: '2026-08-15',
    participants: 45,
  },
];

const mockTeams = [
  {
    id: '1',
    name: 'Morning Warriors',
    members: 32,
    description: 'Early bird training group',
  },
  {
    id: '2',
    name: 'Strength Squad',
    members: 28,
    description: 'Powerlifting focused community',
  },
];

const meta: Meta = {
  title: 'Features/Explore',
  component: ExploreView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Showcase: StoryObj<typeof ExploreView> = {
  render: () => (
    <Carousel>
      <ExploreView events={mockEvents} featuredTeams={mockTeams} />
      <ExploreView events={[]} featuredTeams={[]} />
    </Carousel>
  ),
};

