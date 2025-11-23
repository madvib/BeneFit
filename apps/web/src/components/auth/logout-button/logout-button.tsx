'use client';

import { useActionState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { signOutAction } from '@/controllers/auth/auth-actions';
import { useRouter } from 'next/navigation';
import { useSession } from '@/controllers';

interface LogoutButtonProperties {
  variant?: 'default' | 'ghost';
  className?: string;
}

export function LogoutButton({
  variant = 'default',
  className,
}: LogoutButtonProperties) {
  const [success, action, isLoading] = useActionState(signOutAction, false);
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    if (success) {
      session.refreshSession();
      router.replace('/');
    }
  }, [success]);
  return (
    <form action={action}>
      <button
        type="submit"
        disabled={isLoading}
        className={`${variant === 'ghost' ? 'btn-ghost' : ''} ${variant === 'default' ? 'w-full' : ''} ${className || ''}`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            Signing out...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogOut data-testid="logout-icon" className="h-4 w-4" />
            Logout
          </span>
        )}
      </button>
    </form>
  );
}
