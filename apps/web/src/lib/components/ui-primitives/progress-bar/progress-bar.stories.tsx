import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './progress-bar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    max: { control: { type: 'number' } },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 65,
    max: 100,
    className: 'w-[400px]',
  },
};

export const Gradient: Story = {
  args: {
    ...Default.args,
    variant: 'default',
    barVariant: 'default',
  },
};

export const Solid: Story = {
  args: {
    ...Default.args,
    variant: 'solid',
    barVariant: 'solid',
  },
};

export const Success: Story = {
  args: {
    ...Default.args,
    barVariant: 'success',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-[400px] flex-col gap-6">
      <div className="space-y-1">
        <span className="text-muted-foreground text-xs tracking-wider uppercase">
          Extra Small (xs)
        </span>
        <ProgressBar {...args} size="xs" value={30} />
      </div>
      <div className="space-y-1">
        <span className="text-muted-foreground text-xs tracking-wider uppercase">Small (sm)</span>
        <ProgressBar {...args} size="sm" value={50} />
      </div>
      <div className="space-y-1">
        <span className="text-muted-foreground text-xs tracking-wider uppercase">
          Medium (md)
        </span>
        <ProgressBar {...args} size="md" value={70} />
      </div>
      <div className="space-y-1">
        <span className="text-muted-foreground text-xs tracking-wider uppercase">Large (lg)</span>
        <ProgressBar {...args} size="lg" value={90} />
      </div>
    </div>
  ),
};
