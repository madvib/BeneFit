import { LoginForm } from '@/components/auth/login-form';
import { Modal } from '@/components/common/ui-primitives/modal/modal';

export default function LoginModal() {
  return (
    <Modal title="Login to BeneFit">
      <LoginForm />
    </Modal>
  );
}
