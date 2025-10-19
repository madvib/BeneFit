"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-secondary p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Something went wrong!
            </h2>
            <p className="text-muted-foreground mb-6">
              We&apos;re sorry, but an unexpected error occurred. Our team has
              been notified.
            </p>
            <button className="btn btn-primary w-full" onClick={() => reset()}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
