'use client';


import { ErrorPage } from '@/lib/components';
export default function FeedError({ error, reset }: { error: Error; reset: () => void }) {
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
