import type { Meta, StoryObj } from '@storybook/react';
import {DashboardNavigation,UnifiedHeader,AccountSidebar,AccountHeader} from './';

const meta: Meta = {
  title: 'Components/Navigation',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const DashboardNav: StoryObj<typeof DashboardNavigation> = {
  render: () => (
    <div className="bg-muted/20 rounded-xl p-4">
      <DashboardNavigation />
    </div>
  ),
};

export const HeaderMarketing: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="marketing" />,
  parameters: { layout: 'fullscreen' },
};

export const HeaderApplication: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="application" isLoggedIn={true} />,
  parameters: { layout: 'fullscreen' },
};


export const HeaderAuth: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="auth" />,
  parameters: { layout: 'fullscreen' },
};



export const AccountHeaderComponent: StoryObj<typeof AccountHeader> = {
  render: () => <AccountHeader />,
  parameters: { layout: 'fullscreen' },
};

export const AccountSidebarComponent: StoryObj<typeof AccountSidebar> = {
  render: () => (
    <div className="h-[600px] w-64 border-r">
      <AccountSidebar />
    </div>
  ),
};
