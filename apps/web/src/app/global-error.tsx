'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/components';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorPage
          title="Something went wrong!"
          message="We're sorry, but an unexpected error occurred. Our team has been notified."
          error={error.message}
          showBackButton={false}
          onRefresh={reset}
        />
      </body>
    </html>
  );
}
