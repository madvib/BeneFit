'use client';

import { LoginForm, Modal } from '@/lib/components';
export default function LoginModalRoute() {
  return (
    <Modal isRoute size="sm" unstyled>
      <LoginForm isModalRoute />
    </Modal>
  );
}
