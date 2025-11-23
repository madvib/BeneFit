'use client';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Modal } from '@/components/common/ui-primitives/modal/modal';

export default function LoginModal() {
  return (
    <Modal>
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm isModal={true} />
      </Suspense>
    </Modal>
  );
}
