'use client';

import { Modal, PasswordResetForm } from '@/lib/components';

export default function PasswordResetModal() {
  return (
    <Modal>
      <PasswordResetForm isModal />
    </Modal>
  );
}
