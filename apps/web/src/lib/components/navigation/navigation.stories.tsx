import type { Meta, StoryObj } from '@storybook/react';
import DashboardNavigation from './dashboard-navigation';
import MobileMenuToggle from './mobile-menu-toggle';

const meta: Meta = {
  title: 'Components/Features/Navigation',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const LinkNavigation: StoryObj<typeof DashboardNavigation> = {
  render: () => (
    <div className="bg-muted/20 rounded-xl p-4">
      <DashboardNavigation />
    </div>
  ),
};

export const MobileToggle: StoryObj<typeof MobileMenuToggle> = {
  render: () => (
    <div className="flex gap-4">
      <MobileMenuToggle openMenu={() => console.log('Open Menu')} />
      <div className="bg-primary rounded p-2">
        {/* Contrast check */}
        <MobileMenuToggle openMenu={() => console.log('Open Menu')} />
      </div>
    </div>
  ),
};
