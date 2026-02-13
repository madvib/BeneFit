import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { authClient } from '@bene/react-api-client';
import { Button } from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LogoutButtonProperties {
  variant?: 'default' | 'ghost';
  className?: string;
}

export function LogoutButton({ variant = 'default', className }: LogoutButtonProperties) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await authClient().signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.navigate({ to: ROUTES.HOME, search: { from: 'logout' }, replace: true });
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={loading}
      variant={variant}
      className={cn('inline-flex items-center justify-center gap-2', className)}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut data-testid="logout-icon" className="h-4 w-4 shrink-0" />
          Logout
        </>
      )}
    </Button>
  );
}
