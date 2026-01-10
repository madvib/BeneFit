import type { Meta, StoryObj } from '@storybook/react';
import DashboardNavigation from './dashboard-navigation';
import MobileMenuToggle from './mobile-menu-toggle';
import UnifiedHeader from './unified-header';

const meta: Meta = {
  title: 'Components/Navigation',
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

// --- Unified Header Stories ---

export const HeaderMarketing: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="marketing" />,
  parameters: { layout: 'fullscreen' },
};

export const HeaderApplication: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="application" />,
  parameters: { layout: 'fullscreen' },
};

export const HeaderAuth: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="auth" />,
  parameters: { layout: 'fullscreen' },
};
