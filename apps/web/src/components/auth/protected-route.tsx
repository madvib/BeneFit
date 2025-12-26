'use client';

import { getAuthClient } from '@bene/react-api-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ProtectedRoute({
  children,
  redirectTo = '/login',
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const authClient = getAuthClient();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isPending, router, redirectTo]);

  if (isPending) {
    return <LoadingSpinner variant="screen" />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}