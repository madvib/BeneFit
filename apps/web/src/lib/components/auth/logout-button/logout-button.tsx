'use client';

import { authClient } from '@bene/react-api-client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/lib/constants';

interface LogoutButtonProperties {
  variant?: 'default' | 'ghost';
  className?: string;
}

export function LogoutButton({ variant = 'default', className }: LogoutButtonProperties) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await authClient.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.replace(ROUTES.HOME);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`${variant === 'ghost' ? 'btn-ghost' : ''} ${variant === 'default' ? 'w-full' : ''} ${className || ''}`}
    >
      {loading ? (
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
