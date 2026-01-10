'use client';
import OnboardingStepper from '../../onboarding/_components/onboarding-stepper';
import { Modal } from '@/lib/components';

export default function OnboardingModal() {
  return (
    <Modal size="xl" containerClassName="overflow-hidden">
      <OnboardingStepper />
    </Modal>
  );
}
