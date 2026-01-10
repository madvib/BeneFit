import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';
import SpotlightCard from './spotlight-card';
import ImageCard from './image-card';
import { Trophy } from 'lucide-react';
import { Button } from '../buttons/button';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Standard: Story = {
  args: {
    title: 'Standard Card',
    children: <p className="text-muted-foreground">This is a basic card content area.</p>,
    className: 'h-40',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Card with Icon',
    icon: Trophy,
    description: 'Optional description text goes here',
    children: (
      <div className="space-y-2">
        <div className="bg-muted h-2 w-full rounded" />
        <div className="bg-muted h-2 w-3/4 rounded" />
        <div className="bg-muted h-2 w-1/2 rounded" />
      </div>
    ),
  },
};

export const InteractiveHeader: Story = {
  args: {
    title: 'Interactive Header',
    headerAction: (
      <Button size="sm" variant="outline">
        Action
      </Button>
    ),
    children: <p className="text-muted-foreground">Card with a header action button.</p>,
  },
};

export const SpotlightEffect: StoryObj<typeof SpotlightCard> = {
  render: () => (
    <div className="max-w-md rounded-3xl bg-black/5 p-4">
      <SpotlightCard>
        <div className="relative z-10 text-center">
          <h3 className="mb-2 text-xl font-bold">Spotlight Effect</h3>
          <p className="text-muted-foreground">
            Hover over this card to see the radial gradient tracking your mouse cursor.
          </p>
        </div>
      </SpotlightCard>
    </div>
  ),
};

export const ImageDisplay: StoryObj<typeof ImageCard> = {
  render: () => (
    <div className="max-w-md">
      <ImageCard
        src="https://picsum.photos/id/237/600/400"
        alt="Demo Image"
        width={600}
        height={400}
      />
    </div>
  ),
};
