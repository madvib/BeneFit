'use client';

import { authClient } from '@bene/react-api-client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/lib/components';

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
    <Button onClick={handleSignOut} isLoading={loading} variant={variant} className={className}>
      {!loading && <LogOut data-testid="logout-icon" className="h-4 w-4" />}
      {loading ? 'Signing out...' : 'Logout'}
    </Button>
  );
}
