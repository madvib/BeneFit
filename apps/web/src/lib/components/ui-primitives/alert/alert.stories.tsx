import type { Meta, StoryObj } from '@storybook/react';
import Alert from './alert';
import { CheckCircle } from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    title: 'Information',
    description: 'This is a standard alert message.',
    type: 'info',
  },
};

export const Error: Story = {
  args: {
    title: 'Error',
    description: 'Something went wrong! Please try again.',
    type: 'error',
  },
};

export const Success: Story = {
  render: () => (
    <div className="flex gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-700 dark:text-green-400">
      <CheckCircle className="h-5 w-5" />
      <div>
        <h5 className="font-medium">Success (Custom)</h5>
        <p className="text-sm">Action completed successfully.</p>
      </div>
    </div>
  ),
};
