import {
  Modal,
  LoginForm,
  SignupForm,
  PasswordResetForm,
  UpdatePasswordForm,
} from '@/lib/components';
import { ConfirmEmailNotice } from '@/lib/components/auth/confirm-email-notice';
import { VerifyEmail } from '@/lib/components/auth/verify-email';
import { MODALS } from '@/lib/constants';
import { useHydrated } from '@/lib/hooks/use-hydrated';

interface AuthModalsProps {
  activeModal?: string;
  email?: string;
}

export function AuthModals({ activeModal, email }: Readonly<AuthModalsProps>) {
  const isHydrated = useHydrated();

  // Don't render modals until after hydration to prevent SSR/client mismatch with Framer Motion
  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <Modal isOpen={activeModal === MODALS.LOGIN} size="sm" unstyled>
        <LoginForm />
      </Modal>

      <Modal isOpen={activeModal === MODALS.SIGNUP} size="md" unstyled>
        <SignupForm isModalRoute={true} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.RESET_PASSWORD} size="sm" unstyled>
        <PasswordResetForm />
      </Modal>

      <Modal isOpen={activeModal === MODALS.UPDATE_PASSWORD} size="sm" unstyled>
        <UpdatePasswordForm />
      </Modal>

      <Modal isOpen={activeModal === MODALS.CONFIRM_EMAIL} size="sm" unstyled>
        <ConfirmEmailNotice email={email} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.VERIFY_EMAIL} size="sm" unstyled>
        <VerifyEmail />
      </Modal>
    </>
  );
}
