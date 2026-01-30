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

interface AuthModalsProps {
  activeModal?: string;
  email?: string;
  onClose: () => void;
  onSwitch: (_modal: string) => void;
}

export function AuthModals({ activeModal, email, onClose, onSwitch }: Readonly<AuthModalsProps>) {
  return (
    <>
      <Modal isOpen={activeModal === MODALS.LOGIN} onClose={onClose} size="sm" unstyled>
        <LoginForm isModalRoute={true} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.SIGNUP} onClose={onClose} size="md" unstyled>
        <SignupForm isModalRoute={true} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.RESET_PASSWORD} onClose={onClose} size="sm" unstyled>
        <PasswordResetForm />
      </Modal>

      <Modal isOpen={activeModal === MODALS.UPDATE_PASSWORD} onClose={onClose} size="sm" unstyled>
        <UpdatePasswordForm onPasswordUpdated={() => onSwitch(MODALS.LOGIN)} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.CONFIRM_EMAIL} onClose={onClose} size="sm" unstyled>
        <ConfirmEmailNotice email={email} onClose={onClose} />
      </Modal>

      <Modal isOpen={activeModal === MODALS.VERIFY_EMAIL} onClose={onClose} size="sm" unstyled>
        <VerifyEmail />
      </Modal>
    </>
  );
}
