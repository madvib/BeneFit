import type { Meta, StoryObj } from '@storybook/react';
import { profileScenarios, integrationScenarios } from '@bene/react-api-client/test';
import { useProfile, useConnectedServices, useUserStats } from '@bene/react-api-client';
import { AccountHeader, AccountSidebar, OAuthProviderList, PageContainer, PageHeader, PersonalInfoForm, SecurityForm, SessionInfo } from '@/lib/components';

// Imports from routes
// We need to import the components that were formerly default exports or named exports in pages
// In web-start, these are likely the components attached to the Route.
// We can import the Route and get the component, or if the component is exported separately.
// Let's try importing the Route objects to be safe on paths.

import { Route as ConnectionsRoute } from '@/routes/$user/_account/connections';
import { Route as BillingRoute } from '@/routes/$user/_account/billing';
import { Route as ProfileRoute } from '@/routes/$user/_account/profile';
import { Route as SettingsRoute } from '@/routes/$user/_account/settings';
import { Route as NotificationsRoute } from '@/routes/$user/_account/notifications';

const ConnectionsView = ConnectionsRoute.options.component!;
const BillingPage = BillingRoute.options.component!;
const ProfileView = ProfileRoute.options.component!;
const SettingsClient = SettingsRoute.options.component!;
const NotificationsPage = NotificationsRoute.options.component!;

// Mock AccountLayout
function AccountLayoutMock({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <AccountHeader />
      <div className="flex flex-1 overflow-hidden pt-[var(--header-height)]">
        <aside 
            className="hidden w-64 shrink-0 border-r md:block"
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
  title: 'Pages/Account', 
  component: AccountLayoutMock,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        ...profileScenarios.default,
        ...integrationScenarios.default,
      ],
    },
  },
};

export default meta;

export const AccountInfo: StoryObj = {
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
  render: () => (
    <AccountLayoutMock>
        <div className="max-w-4xl">
            <BillingPage />
        </div>
    </AccountLayoutMock>
  ),
};

export const Connections: StoryObj = {
  render: () => {
    // We can't easily use the hook inside the render function if it's not a component interaction
    // But we CAN use it in the component body passed to render.
    // However, ConnectionsView usually takes props.
    // Let's see if the web-start component takes props or uses hooks.
    // Use the component from the route. If it uses hooks, we just satisfy the providers (MSW).
    // If it takes props, we need to fetch data.
    // The original story did: const { data } = useConnectedServices(); ... <ConnectionsView services={data...} />
    // If the Route component fetches its own data, we just render it.
    // If the Route component expects loader data, we have a problem in Storybook without a loader mock.
    // Most bene components seem to use hooks (useConnectedServices).
    // If the ported component uses hooks, simply rendering it <ConnectionsView /> (renamed from Route component) should work with MSW.
    
    // Let's try rendering the page component directly.
     return (
        <AccountLayoutMock>
            <div className="max-w-4xl">
                 <ConnectionsView />
            </div>
        </AccountLayoutMock>
     )
  },
};

export const Profile: StoryObj = {
  render: () => {
    return (
      <AccountLayoutMock>
        <div className="max-w-4xl">
           {/* Assuming ProfileView is the page component that handles data fetching */}
          <ProfileView />
        </div>
      </AccountLayoutMock>
    );
  },
};

export const Settings: StoryObj = {
  render: () => (
    <AccountLayoutMock>
        <div className="max-w-4xl">
            <SettingsClient />
        </div>
    </AccountLayoutMock>
  ),
};

export const Notifications: StoryObj = {
  render: () => (
    <AccountLayoutMock>
         <div className="max-w-4xl">
            <NotificationsPage />
        </div>
    </AccountLayoutMock>
  ),
};
