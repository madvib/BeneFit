import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { PasswordResetForm } from './password-reset-form';
import { OAuthButton } from './oauth-button';

const meta: Meta = {
  title: 'Components/Features/Authentication',
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
