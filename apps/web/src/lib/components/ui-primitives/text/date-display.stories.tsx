import type { Meta, StoryObj } from '@storybook/react';
import { DateDisplay } from '../../index';

const meta: Meta<typeof DateDisplay> = {
  title: 'Primitives/DateDisplay',
  component: DateDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['short', 'medium', 'long', 'full', 'datetime'],
    },
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'time'],
    },
    date: {
      control: 'date',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateDisplay>;

import { Carousel } from '@/lib/components';

export const Showcase: Story = {
  render: () => {
    const today = new Date();
    return (
      <Carousel className="w-full max-w-xl">
        <div className="flex flex-col items-center gap-4 p-8">
            <h3 className="text-lg font-medium text-muted-foreground">Short</h3>
            <DateDisplay date={today} format="short" className="text-2xl font-bold" />
        </div>
        <div className="flex flex-col items-center gap-4 p-8">
            <h3 className="text-lg font-medium text-muted-foreground">Medium</h3>
            <DateDisplay date={today} format="medium" className="text-2xl font-bold" />
        </div>
        <div className="flex flex-col items-center gap-4 p-8">
            <h3 className="text-lg font-medium text-muted-foreground">Long</h3>
            <DateDisplay date={today} format="long" className="text-2xl font-bold" />
        </div>
        <div className="flex flex-col items-center gap-4 p-8">
            <h3 className="text-lg font-medium text-muted-foreground">Full / DateTime</h3>
            <DateDisplay date={today} format="datetime" className="text-2xl font-bold" />
        </div>

      </Carousel>
    );
  }
};
