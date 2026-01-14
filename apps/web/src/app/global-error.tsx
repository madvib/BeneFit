'use client';

import { ErrorPage } from '@/lib/components';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
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
          error={error}
          showBackButton={false}
          onRefresh={reset}
        />
      </body>
    </html>
  );
}
