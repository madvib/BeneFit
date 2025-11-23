'use client';

import { ErrorPage } from '@/components';
import { useEffect } from 'react';

export default function AuthError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Authentication error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-8">
      <ErrorPage
        title="Authentication Error"
        message={error.message || 'An unexpected error occurred during authentication.'}
        error={error.message}
        showBackButton={true}
        showRefreshButton={true}
        onRefresh={reset}
        backHref="/"
      />
    </div>
  );
}
