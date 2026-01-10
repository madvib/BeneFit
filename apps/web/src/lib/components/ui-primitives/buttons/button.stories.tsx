import type { Meta, StoryObj } from '@storybook/react';
import { Heart, PlayCircle, Edit2 } from 'lucide-react';
import Button from './button';

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

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold">Standard</h3>
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
        <h3 className="text-muted-foreground text-sm font-semibold">Special</h3>
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
        <h3 className="text-muted-foreground text-sm font-semibold">Status</h3>
        <div className="flex flex-col gap-2">
          <Button variant="success">Success</Button>
          <Button variant="soft-success">Soft Success</Button>
        </div>
      </div>
    </div>
  ),
};

export const Soft: Story = {
  args: {
    variant: 'soft',
    children: 'Soft Button',
  },
};

export const Surface: Story = {
  args: {
    variant: 'surface',
    children: 'Surface Button',
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: 'Glass Button',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="bg-primary rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
};

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    children: 'Add Item',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Completed',
  },
};

export const SoftSuccess: Story = {
  args: {
    variant: 'soft-success',
    children: 'View Details',
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <Button {...args} variant="default">
        <PlayCircle size={16} /> Start
      </Button>
      <Button {...args} variant="soft" size="icon">
        <Edit2 size={18} />
      </Button>
      <Button {...args} variant="ghost" size="icon" className="rounded-full">
        <Heart size={18} />
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Please wait',
  },
};
