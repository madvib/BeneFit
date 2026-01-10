import type { Meta, StoryObj } from '@storybook/react';
import BillingView from './billing-view';

const meta: Meta = {
  title: 'Features/Account/Billing',
  component: BillingView,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default: StoryObj<typeof BillingView> = {
  render: () => <BillingView />,
};
