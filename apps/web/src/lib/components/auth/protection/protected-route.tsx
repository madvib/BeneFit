'use client';
import { LoadingSpinner } from '@/lib/components';
import { authClient } from '@bene/react-api-client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ROUTES, buildRoute } from '@/lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireEmailVerified?: boolean;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Protects routes by checking authentication status on mount only.
 * Does not react to auth changes - logout/session expiry handled elsewhere.
 */
export function ProtectedRoute({
  children,
  redirectTo = ROUTES.AUTH.LOGIN,
  requireEmailVerified = false,
  fallback,
}: ProtectedRouteProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hasChecked = useRef(false);

  const isAuthenticated = !!session?.user;
  const isEmailVerified = session?.user?.emailVerified ?? false;

  useEffect(() => {
    // Only check once when loading completes
    if (isPending || hasChecked.current) return;

    hasChecked.current = true;

    // Not authenticated - redirect to login with return URL
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(buildRoute(redirectTo, { next: returnUrl }));
      return;
    }

    // Authenticated but email not verified (if required)
    if (requireEmailVerified && !isEmailVerified) {
      const email = session?.user?.email;
      router.replace(buildRoute(ROUTES.AUTH.CONFIRM_EMAIL, { email: email || '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]); // Only depend on loading state

  // Show loading state
  if (isPending) {
    return fallback || <LoadingSpinner variant="screen" text="Verifying authentication..." />;
  }

  // Not authenticated - show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Email verification required but not verified
  if (requireEmailVerified && !isEmailVerified) {
    return null;
  }

  // Authenticated and verified (if required) - show protected content
  return <>{children}</>;
}
