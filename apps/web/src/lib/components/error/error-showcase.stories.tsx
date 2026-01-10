import type { Meta, StoryObj } from '@storybook/react';
import ErrorPage from './page-error';
import ErrorCard from './error-card';
import InlineError from './inline-error';

const meta: Meta = {
  title: 'Components/Errors',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const FullPage: StoryObj<typeof ErrorPage> = {
  render: (args) => <ErrorPage {...args} />,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Something went wrong',
    message: 'We encountered an unexpected error while processing your request.',
    error: new Error('Stack trace: \n at Page (/app/user/plan/page.tsx:24) \n at ...'),
    showBackButton: true,
    showRefreshButton: true,
    showReportButton: true,
  },
};

export const Card: StoryObj<typeof ErrorCard> = {
  render: (args) => <ErrorCard {...args} />,
  args: {
    title: 'Failed to sync',
    message: 'We could not synchronize your workout data from Apple Health.',
    severity: 'error',
    showRefreshButton: true,
    showReportButton: true,
  },
};

export const Inline: StoryObj<typeof InlineError> = {
  render: (args) => <InlineError {...args} />,
  args: {
    title: 'Incompatible Goals',
    message:
      'Your muscle gain goal requires more recovery time than your current schedule allows.',
    severity: 'warning',
  },
};

export const MaintenanceInfo: StoryObj<typeof ErrorPage> = {
  render: (args) => <ErrorPage {...args} />,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Under Maintenance',
    message: 'We are currently upgrading our servers to improve your experience. Hang tight!',
    severity: 'info',
    showBackButton: true,
    backHref: '/',
  },
};

export const InlineCritical: StoryObj<typeof InlineError> = {
  render: (args) => <InlineError {...args} />,
  args: {
    message: 'Database connection failed. Some features may be unavailable.',
    severity: 'error',
    showRefreshButton: true,
  },
};
