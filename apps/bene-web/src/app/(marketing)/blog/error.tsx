'use client';

import { useEffect } from 'react';

export default function Error({
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
    <div className="container mx-auto p-8">
      <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Failed to load blog posts</h2>
        <p className="text-destructive/80 mb-6">
          {error.message || 'An error occurred while loading the blog content.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="btn btn-primary"
            onClick={reset}
          >
            Try again
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}