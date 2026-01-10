import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from './skeleton';
import Card from '../card/card';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    className: 'h-4 w-[250px]',
  },
};

export const Circle: Story = {
  args: {
    className: 'h-12 w-12 rounded-full',
  },
};

export const ComplexShowcase: Story = {
  render: () => (
    <Card className="w-[350px]" bodyClassName="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-[160px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </Card>
  ),
};
