import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { PasswordResetForm } from './password-reset-form';
import { OAuthButton } from './oauth-button';
import UserAccountMenu from '../navigation/account-dropdown/account-dropdown';
import { UpdatePasswordForm } from './update-password-form';
import AuthCTA from '../navigation/auth-cta';
import { ProtectedRoute } from './protected-route';
import { RequireProfile } from './require-profile';
import { UIProvider } from '../../providers/ui-context';

const meta: Meta = {
  title: 'Features/Auth',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Login: StoryObj<typeof LoginForm> = {
  render: () => (
    <div className="bg-background w-[400px] rounded-xl border p-6">
      <LoginForm />
    </div>
  ),
};

export const LoginModal: StoryObj<typeof LoginForm> = {
  render: () => (
    <div className="bg-background w-[400px] rounded-xl border p-6">
      <LoginForm isModal />
    </div>
  ),
};

export const Signup: StoryObj<typeof SignupForm> = {
  render: () => (
    <div className="bg-background w-[500px] rounded-xl border p-6">
      <SignupForm />
    </div>
  ),
};

export const PasswordReset: StoryObj<typeof PasswordResetForm> = {
  render: () => (
    <div className="bg-background w-[400px] rounded-xl border p-6">
      <PasswordResetForm />
    </div>
  ),
};

export const OAuthButtons: StoryObj = {
  render: () => (
    <div className="flex w-[300px] flex-col gap-4">
      <OAuthButton provider="google" />
      <OAuthButton provider="strava" />
    </div>
  ),
};

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
