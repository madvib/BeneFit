'use client';

import { useEffect } from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@bene/react-api-client';
import { LoadingSpinner } from '@/lib/components';
import { ROUTES, buildRoute } from '@/lib/constants';

/**
 * Auth Status Page
 *
 * Displays current user session data and handles routing based on authentication state.
 * Serves as a central endpoint for authentication status and error handling.
 */
export default function AuthStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, isPending } = authClient.useSession();

  const isAuthenticated = !!session?.user;
  const isEmailVerified = session?.user?.emailVerified ?? false;

  useEffect(() => {
    if (isPending) return;

    // Get redirect destination from query parameters
    const next = searchParams.get('next') || ROUTES.USER.ACTIVITIES;

    // If authenticated and email is verified, redirect to intended destination
    if (isAuthenticated && isEmailVerified) {
      router.replace(next);
      return;
    }

    // If authenticated but email not verified, redirect to confirmation
    if (isAuthenticated && !isEmailVerified) {
      const email = session?.user?.email;
      router.replace(buildRoute(ROUTES.AUTH.CONFIRM_EMAIL, { email: email || '' }));
      return;
    } else {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.replace(buildRoute(ROUTES.AUTH.LOGIN, { next: returnUrl }));
      return;
    }
  }, [isAuthenticated, isEmailVerified, isPending, router, searchParams, session?.user?.email]);

  // While checking authentication status
  if (isPending) {
    return <LoadingSpinner variant="screen" text="Checking authentication status..." />;
  } else redirect(ROUTES.AUTH.LOGIN);
}
