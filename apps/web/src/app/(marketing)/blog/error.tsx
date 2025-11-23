'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/components';

export default function BlogError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Blog page error:', error);
  }, [error]);

  return (
    <ErrorPage
      title="Failed to load blog posts"
      message={error.message || 'An error occurred while loading the blog content.'}
      error={error.message}
      showBackButton={true}
      showRefreshButton={true}
      onRefresh={reset}
      backHref="/"
    />
  );
}
