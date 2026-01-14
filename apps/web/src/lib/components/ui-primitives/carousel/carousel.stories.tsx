import type { Meta, StoryObj } from '@storybook/react';
import {Carousel} from './carousel';
import {Card} from '../card/card';
import {Button} from '../buttons/button';
import { typography } from '../..';

const meta: Meta<typeof Carousel> = {
  title: 'Primitives/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Showcase: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Carousel>
        <Card title="Slide 1" className="min-h-[300px]">
          <div className="space-y-4">
            <p className={typography.body}>
              This is the first slide of the carousel. Use the arrow buttons or keyboard arrows to
              navigate.
            </p>
            <Button variant="default">Action Button</Button>
          </div>
        </Card>
        <Card title="Slide 2" className="min-h-[300px]">
          <div className="space-y-4">
            <p className={typography.body}>
              The carousel automatically adjusts height based on content. This slide has different
              content.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="soft" size="sm">
                Option 1
              </Button>
              <Button variant="soft" size="sm">
                Option 2
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Slide 3" className="min-h-[300px]">
          <div className="space-y-4">
            <p className={typography.body}>
              The final slide. Notice the dot indicators and slide counter below.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Keyboard navigation (← →)</li>
              <li>Click dot indicators to jump to slides</li>
              <li>Previous/Next buttons</li>
              <li>Slide counter display</li>
            </ul>
            <p className={`${typography.muted} mt-2 text-center`}>
              It&apos;s a wrap! Use the navigation below to restart.
            </p>
          </div>
        </Card>
      </Carousel>
    </div>
  ),
};

export const ComponentStates: Story = {
  name: 'Component States (Use Case Demo)',
  render: () => (
    <div className="max-w-xl">
      <h3 className={`mb-4 ${typography.h4}`}>Button Variants Carousel</h3>
      <Carousel>
        <div className="bg-background rounded-2xl border p-8">
          <h4 className={`mb-4 ${typography.labelSm}`}>Standard Variants</h4>
          <div className="flex flex-col gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </div>
        <div className="bg-background rounded-2xl border p-8">
          <h4 className={`mb-4 ${typography.labelSm}`}>Special Variants</h4>
          <div className="flex flex-col gap-2">
            <Button variant="gradient">Gradient</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="glass">Glass</Button>
          </div>
        </div>
        <div className="bg-background rounded-2xl border p-8">
          <h4 className={`mb-4 ${typography.labelSm}`}>Status Variants</h4>
          <div className="flex flex-col gap-2">
            <Button variant="success">Success</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="error">Error</Button>
          </div>
        </div>
      </Carousel>
    </div>
  ),
};

export const SingleSlide: Story = {
  name: 'Single Slide (No Navigation)',
  render: () => (
    <div className="max-w-md">
      <Carousel>
        <Card title="Only One Slide">
          <p className={typography.body}>
            When there&apos;s only one slide, navigation buttons and indicators don&apos;t appear.
          </p>
        </Card>
      </Carousel>
    </div>
  ),
};
