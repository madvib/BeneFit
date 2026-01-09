import { Metadata } from 'next';
import OnboardingStepper from './_components/onboarding-stepper';

export const metadata: Metadata = {
  title: 'Setup Your Profile - BeneFit',
  description: 'Complete your profile to get your personalized fitness plan.',
};

export default function OnboardingPage() {
  return (
    <div className="container mx-auto flex max-w-3xl flex-col items-center py-10">
      <OnboardingStepper />
    </div>
  );
}
