import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '@/lib/components';
import { exploreScenarios } from '@bene/react-api-client/test';
import ExplorePage from './page';

const meta: Meta<typeof ExplorePage> = {
  title: 'Features/Explore',
  component: ExplorePage,
  parameters: {
    layout: 'fullscreen',
    msw: {
        handlers: exploreScenarios.default
    }
  },
};

export default meta;

export const Showcase: StoryObj<typeof ExplorePage> = {
  render: () => (
    <Carousel>
      <ExplorePage />
    </Carousel>
  ),
};

export const Empty: StoryObj<typeof ExplorePage> = {
  render: () => (
    <Carousel>
      <ExplorePage />
    </Carousel>
  ),
  parameters: {
    msw: {
      handlers: exploreScenarios.empty,
    },
  },
};

