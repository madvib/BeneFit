'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/lib/components';
import { ROUTES } from '@/lib/constants';

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
  // TODO extract to a hook used in error component?
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Authentication error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-8">
      <ErrorPage
        title="Authentication Error"
        message={error.message || 'An unexpected error occurred during authentication.'}
        error={error}
        showBackButton={true}
        showRefreshButton={true}
        onRefresh={reset}
        backHref={ROUTES.HOME}
      />
    </div>
  );
}
