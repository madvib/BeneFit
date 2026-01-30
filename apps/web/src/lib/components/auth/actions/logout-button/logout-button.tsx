import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { authClient } from '@bene/react-api-client';
import { Button } from '@/lib/components';
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
      router.navigate({ to: ROUTES.HOME, search: { from: 'logout' }, replace: true });
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleSignOut} isLoading={loading} variant={variant} className={className}>
      <span>
        {!loading && <LogOut data-testid="logout-icon" className="h-4 w-4" />}
        {loading ? 'Signing out...' : 'Logout'}
      </span>
    </Button>
  );
}
