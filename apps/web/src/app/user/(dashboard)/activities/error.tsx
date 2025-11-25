'use client';

import { ErrorPage } from '@/components';
import { useEffect } from 'react';

export default function FeedError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-8">
      <ErrorPage
        title=" Failed to load dashboard"
        message={
          error.message || 'An error occurred while loading your dashboard data.'
        }
        error={error.message}
        showBackButton={true}
        showRefreshButton={true}
        onRefresh={reset}
        backHref="/"
      />
    </div>
  );
}
