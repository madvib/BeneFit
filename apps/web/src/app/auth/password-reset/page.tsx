'use client';


import { PasswordResetForm } from '@/lib/components';
export default function PasswordResetPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="bg-secondary w-full max-w-md rounded-lg p-8 shadow-md">
        <PasswordResetForm />
      </div>
    </div>
  );
}
