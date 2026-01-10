import type { Meta, StoryObj } from '@storybook/react';
import { MetricPill } from './metric-pill';
import { Zap, Flame, Timer } from 'lucide-react';

const meta: Meta<typeof MetricPill> = {
  title: 'Primitives/MetricPill',
  component: MetricPill,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MetricPill>;

export const Default: Story = {
  args: {
    value: '120',
    unit: 'bpm',
    icon: Zap,
  },
};

export const Accent: Story = {
  args: {
    value: '450',
    unit: 'kcal',
    icon: Flame,
    variant: 'accent',
  },
};

export const TimerMetric: Story = {
  args: {
    value: '45',
    unit: 'min',
    icon: Timer,
  },
};

export const Comparison: Story = {
  render: () => (
    <div className="flex gap-4">
      <MetricPill value="120" unit="bpm" icon={Zap} />
      <MetricPill value="450" unit="kcal" icon={Flame} variant="accent" />
      <MetricPill value="45" unit="min" icon={Timer} />
    </div>
  ),
};
