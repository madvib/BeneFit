'use client';

import { Modal, PasswordResetForm } from '@/lib/components';
export default function PasswordResetModalRoute() {
  return (
    <Modal isRoute size="sm" unstyled>
      <PasswordResetForm isModal />
    </Modal>
  );
}
