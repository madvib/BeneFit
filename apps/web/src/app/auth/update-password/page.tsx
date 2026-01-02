'use client';

import { UpdatePasswordForm } from '@/lib/components';

export default function UpdatePasswordPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="bg-secondary w-full max-w-md rounded-lg p-8 shadow-md">
        <h2 className="text-secondary-foreground mb-6 text-center text-3xl font-bold">
          Update Your Password
        </h2>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
