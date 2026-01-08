import type { Meta, StoryObj } from '@storybook/react';
import ErrorPage from './page-error';

const meta: Meta = {
  title: 'Components/Features/Error',
  component: ErrorPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: StoryObj<typeof ErrorPage> = {
  render: () => (
    <ErrorPage
      message="An unexpected error occurred."
      onRefresh={() => alert('Reloading...')}
      onReportClick={() => alert('Reporting...')}
    />
  ),
};

export const WithErrorDetails: StoryObj<typeof ErrorPage> = {
  render: () => (
    <ErrorPage
      title="Network Error"
      message="Could not connect to the server."
      error={new Error('503 Service Unavailable: Timeout waiting for db.connect()')}
      onRefresh={() => alert('Reloading...')}
    />
  ),
};

export const Minimal: StoryObj<typeof ErrorPage> = {
  render: () => (
    <ErrorPage
      title="404 Not Found"
      message="The page you are looking for does not exist."
      showRefreshButton={false}
      showReportButton={false}
    />
  ),
};
