import { useEffect, useRef } from 'react';
import { useRouter, useLocation } from '@tanstack/react-router';
import { authClient } from '@bene/react-api-client';
import { ROUTES, buildRoute } from '@/lib/constants';
import { LoadingSpinner, Modal } from '@/lib/components';
import { ConfirmEmailNotice } from '@/lib/components/auth/confirm-email-notice';

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
  const pathname = useLocation().pathname;
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
      router.navigate({ to: buildRoute(redirectTo, { next: returnUrl }), replace: true });
      return;
    }

    // Authenticated but email not verified (if required)
    // We handle this in the render phase now with a modal
    // if (requireEmailVerified && !isEmailVerified) {
    //   const email = session?.user?.email;
    //   router.navigate({ to: buildRoute(ROUTES.AUTH.CONFIRM_EMAIL, { email: email || '' }), replace: true });
    // }
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
    return (
      <Modal isOpen={true} onClose={() => router.navigate({ to: ROUTES.HOME })} size="sm" unstyled>
         <ConfirmEmailNotice 
            email={session?.user?.email} 
            onClose={() => router.navigate({ to: ROUTES.HOME })} 
         />
      </Modal>
    );
  }

  // Authenticated and verified (if required) - show protected content
  return <>{children}</>;
}
