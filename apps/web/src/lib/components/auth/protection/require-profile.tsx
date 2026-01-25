'use client';

import { LoadingSpinner } from '@/lib/components';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfile } from '@bene/react-api-client';

// List of paths that should bypass profile check to avoid loops
const BYPASS_PATHS = ['/onboarding'];

export function RequireProfile({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userProfile, isPending, error } = useProfile();

  useEffect(() => {
    if (isPending) return;

    // If we are already on onboarding, don't redirect (double check)
    if (pathname && BYPASS_PATHS.some((p) => pathname.startsWith(p))) return;

    // If profile fetch failed (404 likely) or no data, redirect to onboarding
    if (error || !userProfile) {
      console.log('Profile missing or failed to load, redirecting to onboarding');
      router.replace('/onboarding');
    }

    // Check for specific fields if "Partial" profile is possible?
    // For now assuming any profile existence is enough.
  }, [userProfile, isPending, error, router, pathname]);

  if (isPending) {
    return <LoadingSpinner variant="screen" text="Loading profile..." />;
  }

  // If error/missing, we are redirecting, so return null/spinner
  if (error || !userProfile) {
    return <LoadingSpinner variant="screen" text="Redirecting to setup..." />;
  }

  return <>{children}</>;
}
