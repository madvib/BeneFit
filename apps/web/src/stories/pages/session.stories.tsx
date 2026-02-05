import type { Meta, StoryObj } from '@storybook/react';

// Import from the hidden route file
import SessionPage from '@/routes/-session/route';
import { workoutScenarios } from '@bene/react-api-client/test';

const meta: Meta<typeof SessionPage> = {
  title: 'Pages/Active Session',
  component: SessionPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: workoutScenarios.default,
    },
    // Mock the Tanstack Router?
    // SessionPage uses useWorkoutSession hook.
    // It also uses useRouter.
    // We might need to wrap in a RouterProvider or mock useRouter if possible, 
    // or just rely on standard hook mocks if component handles missing context gracefully.
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
