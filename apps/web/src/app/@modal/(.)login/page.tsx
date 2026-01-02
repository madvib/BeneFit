'use client';
import { Suspense } from 'react';
import { Modal } from '@/lib/components/ui-primitives/modal/modal';
import { LoginForm } from '@/lib/components/auth';

export default function LoginModal() {
  return (
    <Modal>
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm isModal />
      </Suspense>
    </Modal>
  );
}
