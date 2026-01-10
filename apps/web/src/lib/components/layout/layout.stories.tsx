import type { Meta, StoryObj } from '@storybook/react';
import PageContainer from './page-container';
import TopTabNavigation from './top-tab-navigation';
import Footer from '../ui-primitives/footer/footer';

const meta: Meta = {
  title: 'Components/Layout',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Container: StoryObj<typeof PageContainer> = {
  render: () => (
    <div className="bg-muted/20 border border-dashed border-red-500">
      <PageContainer>
        <div className="bg-background flex h-40 items-center justify-center rounded-xl border">
          Page Content Constrained
        </div>
      </PageContainer>
    </div>
  ),
};

export const TopTabs: StoryObj<typeof TopTabNavigation> = {
  render: () => (
    <div className="max-w-md">
      <TopTabNavigation
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'details', label: 'Details' },
          { id: 'settings', label: 'Settings' },
        ]}
      >
        {{
          overview: <div className="bg-accent/20 rounded-lg p-4">Overview Content</div>,
          details: <div className="bg-accent/20 rounded-lg p-4">Details Content</div>,
          settings: <div className="bg-accent/20 rounded-lg p-4">Settings Content</div>,
        }}
      </TopTabNavigation>
    </div>
  ),
};

export const SiteFooter: StoryObj<typeof Footer> = {
  render: () => <Footer />,
};
