'use client';


import { UpdatePasswordForm, typography } from '@/lib/components';
export default function UpdatePasswordPage() {
  return (
    // TODO(UI) PageContainer and card here?
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="bg-secondary w-full max-w-md rounded-lg p-8 shadow-md">
        <h2 className={`${typography.h2} text-secondary-foreground mb-6 text-center`}>
          Update Your Password
        </h2>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
