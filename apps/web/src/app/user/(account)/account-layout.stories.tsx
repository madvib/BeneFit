import type { Meta, StoryObj } from '@storybook/react';
import { mockConnectedServices, mockUserProfile, mockUserStats } from '@/lib/testing/fixtures';
import ConnectionsView from './connections/connections-view';
import BillingPage from './billing/page'; 
import ProfileView from './profile/profile-view';
import SettingsClient from './settings/page';
import NotificationsPage from './notifications/page';
import { AccountHeader, AccountSidebar, OAuthProviderList, PageContainer, PageHeader, PersonalInfoForm, SecurityForm, SessionInfo } from '@/lib/components';


// Mock AccountLayout
function AccountLayoutMock({ children }: { children: React.ReactNode }) {
  // Use padding-top to account for fixed header using the CSS variable
  return (
    <div className="flex h-screen flex-col bg-background">
      <AccountHeader />
      <div className="flex flex-1 overflow-hidden pt-[var(--header-height)]">
        <aside 
            className="hidden w-64 shrink-0 border-r md:block"
            // Intercept clicks to prevent navigation in Storybook
            onClickCapture={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('a')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
          <AccountSidebar className="h-full" />
        </aside>
        <main className="flex-1 overflow-y-auto">
             <PageContainer>
                 {children}
             </PageContainer>
        </main>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Features/Account', // Simplified title as requested
  component: AccountLayoutMock,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: []
};


export default meta;

export const AccountInfo: StoryObj = {
  parameters: {
      nextjs: {
          appDirectory: true,
          navigation: {
              pathname: '/user/account',
          },
      },
  },
  render: () => (
    <AccountLayoutMock>
      <div className="max-w-4xl space-y-6">
        <PageHeader title="Account Settings" description="Manage your account settings" />
        <SessionInfo />
        <OAuthProviderList />
        <PersonalInfoForm
          initialData={{
            name: 'Jane Doe',
            email: 'jane@example.com',
            emailVerified: true,
          }}
        />
        <SecurityForm />
      </div>
    </AccountLayoutMock>
  ),
};

export const Billing: StoryObj = {
    parameters: {
      nextjs: {
          appDirectory: true,
          navigation: {
              pathname: '/user/billing',
          },
      },
  },
  render: () => (
    <AccountLayoutMock>
        <div className="max-w-4xl">
            <BillingPage />
        </div>
    </AccountLayoutMock>
  ),
};

export const Connections: StoryObj = {
    parameters: {
      nextjs: {
          appDirectory: true,
          navigation: {
              pathname: '/user/connections',
          },
      },
  },
  render: () => (
    <AccountLayoutMock>
        <div className="max-w-4xl">
            <ConnectionsView
                connectedServices={mockConnectedServices.services}
                onDisconnect={async () => {}}
                onSync={async () => {}}
                syncingServiceId={null}
            />
        </div>
    </AccountLayoutMock>
  ),
};

export const Profile: StoryObj = {
    parameters: {
      nextjs: {
          appDirectory: true,
          navigation: {
              pathname: '/user/profile',
          },
      },
  },
  render: () => (
    <AccountLayoutMock>
        <div className="max-w-4xl">
            <ProfileView userProfile={mockUserProfile} userStats={mockUserStats} />
        </div>
    </AccountLayoutMock>
  ),
};

export const Settings: StoryObj = {
    parameters: {
      nextjs: {
          appDirectory: true,
          navigation: {
              pathname: '/user/settings',
          },
      },
  },
  render: () => (
    <AccountLayoutMock>
        <div className="max-w-4xl">
             {/* Note: Settings requires real data usually fetched in page. 
                 Using the default export which fetches data might fail without mock API.
                 Ideally we refactor SettingsContent to be exported or mock the API.
                 For now, attempting to render with the client component which will hit loading state 
                 unless we mock the hook data.
                 
                 Since SettingsContent is not exported, we have to rely on MSW or API mocks if set up in storybook.
                 Assuming existing environment supports it or it will show error/loading state.
             */}
            <SettingsClient />
        </div>
    </AccountLayoutMock>
  ),
};

export const Notifications: StoryObj = {
    parameters: {
      nextjs: {
          appDirectory: true,
          navigation: {
              pathname: '/user/notifications',
          },
      },
  },
  render: () => (
    <AccountLayoutMock>
         <div className="max-w-4xl">
            <NotificationsPage />
        </div>
    </AccountLayoutMock>
  ),
};
