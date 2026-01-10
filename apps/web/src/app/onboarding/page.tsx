import { Metadata } from 'next';
import OnboardingStepper from './_components/onboarding-stepper';
import { Aurora, PageContainer } from '@/lib/components';

export const metadata: Metadata = {
  title: 'Setup Your Profile - BeneFit',
  description: 'Complete your profile to get your personalized fitness plan.',
};

export default function OnboardingPage() {
  return (
    <PageContainer variant="fullViewport" className="relative flex items-center justify-center">
      {/* Premium Background - Hidden on mobile for cleaner look */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Aurora />
      </div>

      {/* Onboarding Content - Full width on mobile */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-4xl duration-1000">
        <OnboardingStepper />
      </div>
    </PageContainer>
  );
}
