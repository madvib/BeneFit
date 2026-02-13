import type { Meta, StoryObj } from '@storybook/react';
import { coachScenarios } from '@bene/react-api-client/test';
import { ChatHeader } from '@/lib/components';
import { Route } from '@/routes/$user/_chat/coach';

const CoachPage = Route.options.component!;

const meta: Meta<typeof CoachPage> = {
  title: 'Pages/Coach',
  component: CoachPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [...coachScenarios.withMessages],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CoachPage>;

const CoachLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex h-[100dvh] w-full flex-col overflow-hidden">
    <ChatHeader title="AI Coach" />
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <CoachLayout>
      <CoachPage />
    </CoachLayout>
  ),
};

export const WithPendingCheckIn: Story = {
  parameters: {
    msw: {
      handlers: [...coachScenarios.withPendingCheckIn],
    },
  },
  render: () => (
    <CoachLayout>
      <CoachPage />
    </CoachLayout>
  ),
};

export const EmptyHistory: Story = {
  parameters: {
    msw: {
      handlers: [...coachScenarios.emptyHistory],
    },
  },
  render: () => (
    <CoachLayout>
      <CoachPage />
    </CoachLayout>
  ),
};

export const LoadingError: Story = {
  parameters: {
    msw: {
      handlers: [...coachScenarios.serverError],
    },
  },
  render: () => (
    <CoachLayout>
      <CoachPage />
    </CoachLayout>
  ),
};
