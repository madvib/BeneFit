'use client';

import { Modal } from '@/lib/components/ui-primitives/modal/modal';
import { PasswordResetForm } from '@/lib/components';

export default function PasswordResetModal() {
  return (
    <Modal>
      <PasswordResetForm isModal />
    </Modal>
  );
}
