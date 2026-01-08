import type { Meta, StoryObj } from '@storybook/react';
import UserAccountMenu from '../navigation/account-dropdown/account-dropdown';
import { UpdatePasswordForm } from './update-password-form';
import AuthCTA from '../navigation/auth-cta';
import { ProtectedRoute } from './protected-route';
import { RequireProfile } from './require-profile';
import { UIProvider } from '../../providers/ui-context';

const meta: Meta = {
  title: 'Components/Features/Auth',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const AccountDropdown: StoryObj<typeof UserAccountMenu> = {
  render: () => (
    <div className="flex w-64 justify-end">
      <UIProvider>
        <UserAccountMenu isLoggedIn={true} />
      </UIProvider>
    </div>
  ),
};

export const AccountDropdownAccordian: StoryObj<typeof UserAccountMenu> = {
  render: () => (
    <div className="w-64 border p-4">
      <UIProvider>
        {/* Accordian variant usually for mobile */}
        <UserAccountMenu isLoggedIn={true} variant="accordian" />
      </UIProvider>
    </div>
  ),
};

export const CallToAction: StoryObj<typeof AuthCTA> = {
  render: () => <AuthCTA showModal={false} />,
};

export const UpdatePassword: StoryObj<typeof UpdatePasswordForm> = {
  render: () => (
    <div className="w-96 rounded-lg border p-4">
      <UpdatePasswordForm onPasswordUpdated={() => alert('Password Updated')} />
    </div>
  ),
};

export const ProtectedRouteWrapper: StoryObj<typeof ProtectedRoute> = {
  render: () => (
    <div className="border border-dashed p-4">
      <ProtectedRoute>
        <div className="rounded bg-green-100 p-4 text-green-800">
          This content is protected and visible because the mock session is authenticated.
        </div>
      </ProtectedRoute>
    </div>
  ),
};

export const RequireProfileWrapper: StoryObj<typeof RequireProfile> = {
  render: () => (
    <div className="border border-dashed p-4">
      <RequireProfile>
        <div className="rounded bg-blue-100 p-4 text-blue-800">
          This content requires a profile and is visible.
        </div>
      </RequireProfile>
    </div>
  ),
};
