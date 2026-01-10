import type { Meta, StoryObj } from '@storybook/react';
import LoadingSpinner from './loading-spinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Primitives/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Showcase: StoryObj<typeof LoadingSpinner> = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-4">
        <LoadingSpinner size="sm" />
        <LoadingSpinner size="md" />
        <LoadingSpinner size="lg" />
      </div>
      <LoadingSpinner text="Loading your data..." />
      <div className="relative flex h-[200px] w-[300px] items-center justify-center overflow-hidden rounded-xl border border-dashed">
        <LoadingSpinner variant="screen" text="Full Screen Variant" />
      </div>
    </div>
  ),
};
