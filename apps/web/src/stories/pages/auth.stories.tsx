import { CheckCircle2, Zap, BarChart3, Users } from 'lucide-react';
import { profileScenarios } from '@bene/react-api-client/test';
import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm, SignupForm, typography } from '@/lib/components';
import { ConfirmEmailNotice } from '@/lib/components/auth/confirm-email-notice';

const meta: Meta = {
  title: 'Pages/Authentication',
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: profileScenarios.default,
    },
  },
};

export default meta;

export const Login: StoryObj = {
  render: () => (
    <div className="flex h-screen w-full overflow-hidden pt-16">
      {/* Left Section: Marketing/Branding */}
      <div className="relative hidden w-1/2 flex-col justify-center p-12 md:flex">
        {/* Background - Solid Primary */}
        <div className="bg-primary absolute inset-0" />

        {/* Content Layer */}
        <div className="text-primary-foreground relative z-10">
          <h1 className={`mb-4 ${typography.h1}`}>Welcome Back!</h1>
          <p className={`${typography.lead} max-w-md opacity-90`}>
            Join thousands of users achieving their fitness goals with our personalized approach.
          </p>

          <div className="mt-8 space-y-4">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <p className={typography.muted}>Sign in to your account</p>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className={typography.small}>Subscribe to newsletter</span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className={typography.p}>Health insights & analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="bg-background flex w-full items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  ),
};

export const Signup: StoryObj = {
  render: () => (
    <div className="flex h-screen w-full flex-col pt-16 md:flex-row">
      {/* Left Section: Marketing/Branding */}
      <div className="relative hidden w-full flex-col justify-center p-12 md:flex md:w-1/2">
        {/* Background - Solid Primary */}
        <div className="bg-primary absolute inset-0" />

        {/* Content Layer */}
        <div className="text-primary-foreground relative z-10">
          <h1 className={`mb-4 ${typography.h1}`}>Join Us Today!</h1>
          <p className={`${typography.lead} max-w-md opacity-90`}>
            Start your wellness journey with personalized fitness plans and community support.
          </p>

          <div className="mt-8 space-y-4">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <span className={typography.small}>User Name</span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className={typography.p}>Connect with fitness community</span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className={typography.p}>Track your progress visually</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Signup Form */}
      <div className="bg-background flex w-full items-center justify-center p-6 md:w-1/2">
        <div className="scrollbar-none max-h-[calc(100vh-4rem)] w-full max-w-md overflow-y-auto">
          <SignupForm />
        </div>
      </div>
    </div>
  ),
};

export const ConfirmEmail: StoryObj = {
  render: () => <ConfirmEmailNotice email="user@example.com" />,
};
