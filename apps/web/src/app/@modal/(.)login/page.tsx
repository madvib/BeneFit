'use client';
import { Modal, LoginForm } from '@/lib/components';

export default function LoginModal() {
  return (
    <Modal>
      <LoginForm isModal />
    </Modal>
  );
}
