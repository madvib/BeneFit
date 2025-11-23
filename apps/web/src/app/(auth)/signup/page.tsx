import { SignupForm } from '@/components/auth/signup-form';
import { CheckCircle2, Users, BarChart3 } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Section: Marketing/Branding */}
      <div className="relative hidden w-1/2 flex-col justify-center p-12 md:flex">
        {/* Background Gradient Layer */}
        <div className="from-primary to-primary/90 absolute inset-0 bg-linear-to-br" />

        {/* Content Layer (z-10 to sit on top of gradient) */}
        <div className="text-primary-foreground relative z-10">
          <h1 className="mb-4 text-4xl font-bold">Join Us Today!</h1>
          <p className="max-w-md text-xl opacity-90">
            Start your wellness journey with personalized fitness plans and community
            support.
          </p>

          <div className="mt-8 space-y-4">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 rounded-full p-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="font-medium">Personalized fitness plans</span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 rounded-full p-2">
                <Users className="h-6 w-6" />
              </div>
              <span className="font-medium">Connect with fitness community</span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 rounded-full p-2">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className="font-medium">Track your progress visually</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Signup Form */}
      <div className="bg-background flex w-full items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
