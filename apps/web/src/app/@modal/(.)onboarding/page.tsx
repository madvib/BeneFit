'use client';


import { Modal, OnboardingStepper } from '@/lib/components';
export default function OnboardingModalRoute() {
  return (
    <Modal isRoute size="xl" containerClassName="overflow-hidden">
      <OnboardingStepper />
    </Modal>
  );
}
