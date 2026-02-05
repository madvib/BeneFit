import type { Meta, StoryObj } from '@storybook/react';
import { Heart, PlayCircle, Edit2 } from 'lucide-react';
import { typography } from '../../';
import {Button} from './button';
import {Carousel} from '../carousel/carousel';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'gradient',
        'soft',
        'surface',
        'glass',
        'dashed',
        'success',
        'soft-success',
        'error',
        'soft-error',
        'outline-destructive',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Showcase: Story = {
  render: () => (
    <Carousel>
      {/* Standard Variants */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className={`${typography.labelSm} text-muted-foreground font-semibold`}>
            Standard
          </h3>
          <div className="flex flex-col gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className={`${typography.labelSm} text-muted-foreground font-semibold`}>Special</h3>
          <div className="flex flex-col gap-2">
            <Button variant="soft">Soft</Button>
            <Button variant="surface" className="bg-gray-100 dark:bg-gray-800">
              Surface
            </Button>
            <Button variant="dashed">Dashed (Add)</Button>
            <div className="bg-primary rounded-lg p-4">
              <Button variant="glass">Glass (On Dark)</Button>
            </div>
            <Button variant="gradient">Gradient</Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className={`${typography.labelSm} text-muted-foreground font-semibold`}>Status</h3>
          <div className="flex flex-col gap-2">
            <Button variant="success">Success</Button>
            <Button variant="soft-success">Soft Success</Button>
            <Button variant="error">Error</Button>
            <Button variant="soft-error">Soft Error</Button>
            <Button variant="outline-destructive">Outline Destructive</Button>
          </div>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-4">
        <h3 className={`${typography.h4} font-semibold`}>With Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">
            <PlayCircle size={16} /> Start
          </Button>
          <Button variant="soft" size="icon">
            <Edit2 size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart size={18} />
          </Button>
          <Button variant="outline">
            <Edit2 size={16} /> Edit
          </Button>
          <Button variant="success">
            <PlayCircle size={16} /> Begin
          </Button>
        </div>
      </div>
    </Carousel>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className={`${typography.labelSm} font-semibold`}>Loading States</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" isLoading>
            Processing
          </Button>
          <Button variant="soft" isLoading>
            Please wait
          </Button>
          <Button variant="outline" isLoading>
            Loading
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className={`${typography.labelSm} font-semibold`}>Disabled States</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" disabled>
            Disabled
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
          <Button variant="soft" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className={`${typography.labelSm} font-semibold`}>Sizes</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Heart size={18} />
          </Button>
        </div>
      </div>
    </div>
  ),
};
