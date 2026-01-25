import type { Meta, StoryObj } from '@storybook/react';

import SessionPage from './page';
import { workoutScenarios } from '@bene/react-api-client/test';

const meta: Meta<typeof SessionPage> = {
  title: 'Features/Active Session',
  component: SessionPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: workoutScenarios.default,
    },
    // Mock the nextjs router/params
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/user/workouts/session/session-123',
        query: { sessionId: 'session-123' },
      },
    },
  },
};

export default meta;

export const Showcase: StoryObj<typeof SessionPage> = {
  render: () => <SessionPage />,
};

export const Loading: StoryObj<typeof SessionPage> = {
  parameters: {
    msw: {
      handlers: workoutScenarios.loading,
    },
  },
  render: () => <SessionPage />,
};

