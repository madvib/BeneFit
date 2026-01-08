import type { Meta, StoryObj } from '@storybook/react';
import QuickActions from './quick-actions';

const meta: Meta<typeof QuickActions> = {
  title: 'Pages/Dashboard/Plan/QuickActions',
  component: QuickActions,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuickActions>;

// --- Stories ---

export const Default: Story = {
  name: 'Default Actions',
  args: {
    onCreatePlan: () => console.log('Create plan'),
    onSavePlan: () => console.log('Save plan'),
    onExportPlan: () => console.log('Export plan'),
    isLoading: false,
  },
};

export const WithPauseAction: Story = {
  name: 'With Pause Action',
  args: {
    onCreatePlan: () => console.log('Create plan'),
    onSavePlan: () => console.log('Save plan'),
    onExportPlan: () => console.log('Export plan'),
    onPausePlan: () => console.log('Pause plan'),
    isLoading: false,
  },
};

export const Loading: Story = {
  name: 'Loading State',
  args: {
    onCreatePlan: () => console.log('Create plan'),
    onSavePlan: () => console.log('Save plan'),
    onExportPlan: () => console.log('Export plan'),
    onPausePlan: () => console.log('Pause plan'),
    isLoading: true,
  },
};

export const Mobile: Story = {
  name: 'Mobile View',
  args: {
    onCreatePlan: () => console.log('Create plan'),
    onSavePlan: () => console.log('Save plan'),
    onExportPlan: () => console.log('Export plan'),
    onPausePlan: () => console.log('Pause plan'),
    isLoading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  name: 'Tablet View',
  args: {
    onCreatePlan: () => console.log('Create plan'),
    onSavePlan: () => console.log('Save plan'),
    onExportPlan: () => console.log('Export plan'),
    onPausePlan: () => console.log('Pause plan'),
    isLoading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
