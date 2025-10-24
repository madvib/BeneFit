"use client";

import { SignupForm } from "@/presentation/auth/signup-form";
import { Modal } from "@/presentation/ui/Modal/modal";

export default function SignupModal() {
  return (
    <Modal title="Create Account">
      <SignupForm />
    </Modal>
  );
}
