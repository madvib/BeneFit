import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './forms/login-form';
import { AccountSettingsForm } from './forms/account-settings-form';

export const AccountSettingsFormStory: StoryObj<typeof AccountSettingsForm> = {
  name: 'Account Settings Form',
  render: () => (
    <div className="max-w-xl p-4">
      <AccountSettingsForm
        initialName="John Doe"
        initialEmail="john@example.com"
        onSave={async (data) => {
          console.log('Save Details', data);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        isLoading={false}
      />
    </div>
  ),
};

import { SignupForm } from './forms/signup-form';
import { PasswordResetForm } from './forms/password-reset-form';
import { UpdatePasswordForm } from './forms/update-password-form';
import { UserAccountMenu } from '../navigation/account/account-dropdown/account-dropdown';
import { AuthCTA } from '../navigation/account/auth-cta';
import { UIProvider } from '../../providers/ui-context';
import { Carousel } from '../ui-primitives';
import { typography } from '@/lib/components';

const meta: Meta = {
  title: 'Components/Auth',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const AuthForms: StoryObj = {
  render: () => (
    <div className="w-[500px]">
      <Carousel>
        {/* Login */}
        <div className="flex flex-col items-center p-4">
          <h3 className={`mb-4 ${typography.h4}`}>Login Form</h3>
          <div className="bg-background w-full rounded-xl border p-6">
            <LoginForm />
          </div>
        </div>

        {/* Signup */}
        <div className="flex flex-col items-center p-4">
          <h3 className={`mb-4 ${typography.h4}`}>Signup Form</h3>
          <div className="bg-background w-full rounded-xl border p-6">
            <SignupForm />
          </div>
        </div>

        {/* Reset Password */}
        <div className="flex flex-col items-center p-4">
          <h3 className={`mb-4 ${typography.h4}`}>Reset Password</h3>
          <div className="bg-background w-full rounded-xl border p-6">
            <PasswordResetForm />
          </div>
        </div>

        {/* Update Password */}
        <div className="flex flex-col items-center p-4">
          <h3 className={`mb-4 ${typography.h4}`}>Update Password</h3>
          <div className="bg-background w-full rounded-xl border p-6">
            <UpdatePasswordForm onPasswordUpdated={() => alert('Updated!')} />
          </div>
        </div>
      </Carousel>
    </div>
  ),
};

export const NavigationElements: StoryObj = {
  render: () => (
    <div className="w-[600px] space-y-8">
      {/* Auth CTA */}
      <div className="bg-background space-y-4 rounded-lg border p-6">
        <div className="mb-4 border-b pb-2">
          <h3 className={typography.label}>Guest Navigation (Auth CTA)</h3>
          <p className={typography.muted}>Appears in navbar when user is not logged in</p>
        </div>
        <div className="bg-muted/30 flex items-center justify-between rounded-md p-4">
          <span className={typography.label}>Bene</span>
          <div className="flex gap-2">
            <AuthCTA showModal={true} />
          </div>
        </div>
      </div>

      {/* Account Dropdown */}
      <div className="bg-background space-y-4 rounded-lg border p-6">
        <div className="mb-4 border-b pb-2">
          <h3 className={typography.label}>User Navigation</h3>
          <p className={typography.muted}>Appears in navbar when user is logged in</p>
        </div>
        <div className="bg-muted/30 flex items-center justify-between rounded-md p-4">
          <span className={typography.label}>Bene</span>
          <UIProvider>
            <UserAccountMenu isLoggedIn={true} />
          </UIProvider>
        </div>
      </div>
    </div>
  ),
};
