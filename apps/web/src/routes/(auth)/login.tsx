import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, Zap, BarChart3 } from 'lucide-react';
import { LoginForm, typography } from '@/lib/components';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Section: Marketing/Branding */}
      <div className="relative hidden w-1/2 flex-col justify-center p-12 md:flex">
        {/* Background Gradient Layer */}
        <div className="from-primary to-primary/90 absolute inset-0 bg-linear-to-br" />

        {/* Content Layer */}
        <div className="text-primary-foreground relative z-10">
          <h1 className={`${typography.h1Inherit} mb-4`}>Welcome Back!</h1>
          <p className={`${typography.leadInherit} max-w-md opacity-90`}>
            Join thousands of users achieving their fitness goals with our personalized approach.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className={typography.pInherit}>Track your workouts and progress</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-2">
                <Zap className="h-6 w-6" />
              </div>
              <span className={typography.pInherit}>Customized fitness plans</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-2">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className={typography.pInherit}>Health insights & analytics</span>
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
  );
}
