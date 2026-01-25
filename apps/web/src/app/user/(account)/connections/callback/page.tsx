'use client';

import { ErrorPage, LoadingSpinner } from '@/lib/components';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConnect } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';

export default function IntegrationCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const connectMutation = useConnect();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const code = searchParams.get('code');
    const rawServiceType = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return;
    }

    if (code) {
      // Validate serviceType to ensure it matches the expected type
      const serviceType: 'strava' | 'garmin' =
        rawServiceType === 'strava' || rawServiceType === 'garmin' ? rawServiceType : 'strava'; // Default fallback

      hasRun.current = true;
      connectMutation
        .mutateAsync({
          json: {
            serviceType,
            authorizationCode: code,
            redirectUri: globalThis.location.origin + '/user/connections/callback',
          },
        })
        .then(() => {
          router.push(ROUTES.USER.CONNECTIONS);
        })
        .catch((err: unknown) => {
          console.error('Failed to connect service', err);
        });
    } else {
      // No code, redirect back
      router.push(ROUTES.USER.CONNECTIONS);
    }
  }, [searchParams, connectMutation, router]);

  if (connectMutation.isError || searchParams.get('error')) {
    return (
      <ErrorPage
        title="Connection Failed"
        message={connectMutation.error?.message || 'Failed to authenticate with the service.'}
        backHref={ROUTES.USER.CONNECTIONS}
      />
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <LoadingSpinner />
        <p className="text-muted-foreground">Connecting to service...</p>
      </div>
    </div>
  );
}
