import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './loading-spinner';

const meta: Meta = {
  title: 'Components/Primitives/Loading',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj<typeof LoadingSpinner> = {
  render: () => <LoadingSpinner />,
};

export const Small: StoryObj<typeof LoadingSpinner> = {
  render: () => <LoadingSpinner size="sm" />,
};

export const Large: StoryObj<typeof LoadingSpinner> = {
  render: () => <LoadingSpinner size="lg" />,
};

export const WithText: StoryObj<typeof LoadingSpinner> = {
  render: () => <LoadingSpinner text="Loading Data..." />,
};

export const FullScreen: StoryObj<typeof LoadingSpinner> = {
  render: () => (
    <div className="relative h-[300px] rounded border">
      <LoadingSpinner variant="screen" text="Full Screen Loader" className="min-h-full" />
    </div>
  ),
};
