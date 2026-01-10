import type { Meta, StoryObj } from '@storybook/react';
import Aurora from './aurora';

const meta: Meta<typeof Aurora> = {
  title: 'Primitives/Backgrounds/Aurora',
  component: Aurora,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Aurora>;

export const Default: Story = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden bg-black">
      <Aurora colorStops={['#FF0000', '#00FF00', '#0000FF']} speed={0.5} />
      <div className="relative z-10 flex h-full items-center justify-center text-2xl font-bold text-white">
        Aurora Effect
      </div>
    </div>
  ),
};

export const Soft: Story = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden bg-zinc-950">
      <Aurora colorStops={['#3b82f6', '#8b5cf6', '#d946ef']} speed={0.2} />
      <div className="relative z-10 flex h-full items-center justify-center text-2xl font-bold text-white/80">
        Soft Aurora
      </div>
    </div>
  ),
};
