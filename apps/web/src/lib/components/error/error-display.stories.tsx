import type { Meta, StoryObj } from '@storybook/react';
import ErrorDisplay from './error-display';

const meta: Meta<typeof ErrorDisplay> = {
  title: 'Components/ErrorDisplay',
  component: ErrorDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['page', 'card', 'inline'],
    },
    severity: {
      control: 'select',
      options: ['error', 'warning', 'info'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErrorDisplay>;

export const FullPageError: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    variant: 'page',
    title: 'Something went wrong',
    message: 'We encountered an unexpected error while processing your request.',
    error: new Error('Stack trace: \n at Page (/app/user/plan/page.tsx:24) \n at ...'),
    showBackButton: true,
    showRefreshButton: true,
    showReportButton: true,
  },
};

export const CardError: Story = {
  args: {
    variant: 'card',
    title: 'Failed to sync',
    message: 'We could not synchronize your workout data from Apple Health.',
    severity: 'error',
    showRefreshButton: true,
    showReportButton: true,
  },
};

export const InlineError: Story = {
  args: {
    variant: 'inline',
    title: 'Incompatible Goals',
    message:
      'Your muscle gain goal requires more recovery time than your current schedule allows.',
    severity: 'warning',
  },
};

export const InfoMessage: Story = {
  args: {
    variant: 'page',
    title: 'Under Maintenance',
    message: 'We are currently upgrading our servers to improve your experience. Hang tight!',
    severity: 'info',
    showBackButton: true,
    backHref: '/',
  },
};

export const InlineCritical: Story = {
  args: {
    variant: 'inline',
    message: 'Database connection failed. Some features may be unavailable.',
    severity: 'error',
    showRefreshButton: true,
  },
};
