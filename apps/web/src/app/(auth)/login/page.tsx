import { CheckCircle2, Zap, BarChart3 } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    // Main Container: h-screen ensures full viewport height, overflow-hidden prevents scrolling
    <div className="flex h-screen w-full overflow-hidden pt-16">
      {/* Left Section: Marketing/Branding */}
      {/* Added 'relative' so the gradient and content layer correctly */}
      <div className="relative hidden w-1/2 flex-col justify-center p-12 md:flex">
        {/* Background Gradient Layer */}
        <div className="from-primary to-primary/90 absolute inset-0 bg-linear-to-br" />

        {/* Content Layer (z-10 to sit on top of gradient) */}
        <div className="text-primary-foreground relative z-10">
          <h1 className="mb-4 text-4xl font-bold">Welcome Back!</h1>
          <p className="max-w-md text-xl opacity-90">
            Join thousands of users achieving their fitness goals with our personalized
            approach.
          </p>

          <div className="mt-8 space-y-4">
            {/* Item 1 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 rounded-full p-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="font-medium">Track your workouts and progress</span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 rounded-full p-2">
                <Zap className="h-6 w-6" />
              </div>
              <span className="font-medium">Customized fitness plans</span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 rounded-full p-2">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className="font-medium">Health insights & analytics</span>
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
