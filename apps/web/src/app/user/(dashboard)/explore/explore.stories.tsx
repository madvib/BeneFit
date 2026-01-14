import type { Meta, StoryObj } from '@storybook/react';
import ExploreView from './explore-view';
import { mockEvents, mockTeams } from '@/lib/testing/fixtures';
import { Carousel } from '@/lib/components';

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
