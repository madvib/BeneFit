'use client';

import { SignupForm } from '@/components/auth/signup-form';
import { Modal } from '@/components/common/ui-primitives/modal/modal';

export default function SignupModal() {
  return (
    <Modal title="Create Account">
      <SignupForm />
    </Modal>
  );
}
