'use client';
import { Suspense } from 'react';
import { Modal, LoginForm } from '@/lib/components';

export default function LoginModal() {
  return (
    <Modal>
      <LoginForm isModal />
    </Modal>
  );
}
