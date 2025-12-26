'use client';

import { getAuthClient } from '@bene/react-api-client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface LogoutButtonProperties {
  variant?: 'default' | 'ghost';
  className?: string;
}

export function LogoutButton({
  variant = 'default',
  className,
}: LogoutButtonProperties) {
  const authClient = getAuthClient();
  const signOutMutation = authClient.signOut.use();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isLoading = signOutMutation.isPending;

  return (
    <button
      onClick={handleSignOut}
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
  );
}
