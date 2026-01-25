import type { Meta, StoryObj } from '@storybook/react';
import { workoutScenarios, profileScenarios } from '@bene/react-api-client/test';
import ActivityFeedPage from '../page';

const meta: Meta<typeof ActivityFeedPage> = {
  title: 'Features/Activities',
  component: ActivityFeedPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        ...workoutScenarios.default,
        ...profileScenarios.default,
      ],
    },
  },
};

export default meta;


// No custom render needed as ActivityFeedPage handles everything

export const Default: StoryObj<typeof ActivityFeedPage> = {
  render: () => <ActivityFeedPage />,
};

export const Empty: StoryObj<typeof ActivityFeedPage> = {
  parameters: {
    msw: {
      handlers: [
        ...workoutScenarios.emptyHistory,
        ...profileScenarios.default,
      ],
    },
  },
  render: () => <ActivityFeedPage />,
};

export const LoadError: StoryObj<typeof ActivityFeedPage> = {
  parameters: {
    msw: {
      handlers: [
        ...workoutScenarios.error,
        ...profileScenarios.default,
      ],
    },
  },
  render: () => <ActivityFeedPage />,
};

