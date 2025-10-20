"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-8">
      <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Something went wrong!
        </h2>
        <p className="text-destructive/80 mb-6">
          {error.message ||
            "An unexpected error occurred while loading this page."}
        </p>
        <button
          className="btn btn-primary"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    </div>
  );
}
