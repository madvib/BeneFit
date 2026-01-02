'use client';

import { SignupForm } from '@/lib/components/auth';
import { Modal } from '@/lib/components/ui-primitives/modal/modal';

export default function SignupModal() {
  return (
    <Modal>
      <SignupForm isModal={true} />
    </Modal>
  );
}
