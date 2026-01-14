import type { Meta, StoryObj } from '@storybook/react';
import { mockPushIntensitySession } from '@/lib/testing/fixtures';
import SessionView from './session-view';

const meta: Meta<typeof SessionView> = {
  title: 'Features/Active Session',
  component: SessionView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Showcase: StoryObj<typeof SessionView> = {
  render: () => (
    <SessionView
      session={mockPushIntensitySession}
      onComplete={(perf) => console.log('Complete', perf)}
      onAbort={() => console.log('Abort')}
    />
  ),
};
