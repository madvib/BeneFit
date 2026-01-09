import type { Meta, StoryObj } from '@storybook/react';
import UnifiedHeader from './unified-header';

const meta: Meta<typeof UnifiedHeader> = {
  title: 'Navigation/UnifiedHeader',
  component: UnifiedHeader,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof UnifiedHeader>;

export const Marketing: Story = {
  args: {
    variant: 'marketing',
  },
};

export const Application: Story = {
  args: {
    variant: 'application',
  },
};

export const Auth: Story = {
  args: {
    variant: 'auth',
  },
};
