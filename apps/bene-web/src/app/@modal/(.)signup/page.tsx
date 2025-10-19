"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import { Modal } from "@/components/ui/Modal";

export default function SignupModal() {
  return (
    <Modal title="Create Account">
      <SignupForm />
    </Modal>
  );
}
