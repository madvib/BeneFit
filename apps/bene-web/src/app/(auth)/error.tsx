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
    console.error('Authentication error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h2>
        <p className="text-destructive/80 mb-6">
          {error.message || 'An unexpected error occurred during authentication.'}
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="btn btn-primary px-4 py-2 rounded-md"
            onClick={reset}
          >
            Try again
          </button>
          <button
            className="btn btn-secondary px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
}