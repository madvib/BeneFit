import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, Users, BarChart3 } from 'lucide-react';
import { SignupForm, typography } from '@/lib/components';

export const Route = createFileRoute('/(auth)/signup')({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Left Section: Marketing/Branding */}
      <div className="relative hidden w-full flex-col justify-center p-12 md:flex md:w-1/2">
        {/* Background Gradient Layer */}
        <div className="from-primary to-primary/90 absolute inset-0 bg-linear-to-br" />
        {/* Content Layer */}
        <div className="text-primary-foreground relative z-10">
          <h1 className={`${typography.h1Inherit} mb-4`}>Join Us Today!</h1>
          <p className={`${typography.leadInherit} max-w-md opacity-90`}>
            Start your wellness journey with personalized fitness plans and community support.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className={typography.pInherit}>Personalized fitness plans</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-2">
                <Users className="h-6 w-6" />
              </div>
              <span className={typography.pInherit}>Connect with fitness community</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 p-2">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className={typography.pInherit}>Track your progress visually</span>
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
  );
}
