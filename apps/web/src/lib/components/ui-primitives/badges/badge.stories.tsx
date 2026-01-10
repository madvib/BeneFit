import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { ShieldCheck, AlertCircle, Info, Star } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'destructive',
        'success',
        'warning',
        'error',
        'info',
        'active',
        'inactive',
        'primaryLight',
        'accent',
      ],
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="primaryLight">Primary Light</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="active">Active</Badge>
      <Badge variant="inactive">Inactive</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge variant="success" icon={ShieldCheck}>
        Verified
      </Badge>
      <Badge variant="warning" icon={AlertCircle}>
        Warning
      </Badge>
      <Badge variant="info" icon={Info}>
        Information
      </Badge>
      <Badge variant="accent" icon={Star}>
        Featured
      </Badge>
    </div>
  ),
};

export const LargeBadge: Story = {
  args: {
    variant: 'accent',
    children: 'Total Sessions: 12',
    className: 'px-4 py-2 text-sm rounded-lg',
  },
};
