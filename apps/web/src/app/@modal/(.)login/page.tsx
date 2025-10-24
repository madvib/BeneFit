import { LoginForm } from "@/presentation/auth/login-form";
import { Modal } from "@/presentation/ui/Modal/modal";

export default function LoginModal() {
  return (
    <Modal title="Login to BeneFit">
      <LoginForm />
    </Modal>
  );
}
