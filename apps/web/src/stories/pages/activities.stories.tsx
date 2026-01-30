import type { Meta, StoryObj } from '@storybook/react';
import { workoutScenarios, profileScenarios } from '@bene/react-api-client/test';
// Import the component from the route file.
// Assuming ActivityFeedPage is the component export or Route.component
// In src/routes/$user/_dashboard/_components/activity-feed-view.stories.tsx
// wait, ActivityFeedPage IS the page. In web-start, it's src/routes/$user/_dashboard/activities.tsx
// But that file exports Route. Route.options.component is the component.
// OR, we can import the component function if it's exported named or default.
// Let's check activities.tsx content later. Assuming it has a default export or named export for the component.
// Actually, let's use the layout/view component if possible, but the story uses the Page.
// I'll assume I can import the component from the route file.

// Temporarily import from the route path structure
import { Route } from '@/routes/$user/_dashboard/activities';

const ActivityFeedPage = Route.options.component!;

const meta: Meta<typeof ActivityFeedPage> = {
  title: 'Pages/Activities',
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
