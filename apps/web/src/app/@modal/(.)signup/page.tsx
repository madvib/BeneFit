'use client';

import { Modal, SignupForm } from '@/lib/components';
export default function SignupModalRoute() {
  return (
    <Modal isRoute size="md" unstyled>
      <SignupForm isModalRoute />
    </Modal>
  );
}
