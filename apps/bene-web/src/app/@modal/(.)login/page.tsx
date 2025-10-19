import { LoginForm } from "@/components/auth/LoginForm";
import { Modal } from "@/components/ui/Modal";

export default function LoginModal() {
  return (
    <Modal title="Login to BeneFit">
      <LoginForm />
    </Modal>
  );
}
