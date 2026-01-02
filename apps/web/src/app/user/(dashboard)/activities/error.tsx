'use client';

import { ErrorPage } from '@/lib/components';
import { useEffect } from 'react';

export default function FeedError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-8">
      <ErrorPage
        title=" Failed to load dashboard"
        message={error.message || 'An error occurred while loading your dashboard data.'}
        error={error}
        showBackButton={true}
        showRefreshButton={true}
        onRefresh={reset}
        backHref="/"
      />
    </div>
  );
}
