"use client";

import { useMemo } from "react";
import { createClient as createBrowserClient } from "infrastructure";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParameters = useSearchParams();
  const supabase = createBrowserClient();

  const { errorType, errorMessage } = useMemo(() => {
    const error = searchParameters.get("error");
    const error_description = searchParameters.get("error_description");
    
    return {
      errorType: error || undefined,
      errorMessage: error_description || "An authentication error occurred"
    };
  }, [searchParameters]);

  const handleRetry = () => {
    // Attempt to get current session to see if user is still logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      globalThis.location.href = session ? "/feed" : "/login";
    });
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case "user_not_confirmed": {
        return "Email Not Confirmed";
      }
      case "invalid_credentials": {
        return "Invalid Credentials";
      }
      case "session_expired": {
        return "Session Expired";
      }
      case "too_many_attempts": {
        return "Too Many Attempts";
      }
      default: {
        return "Authentication Error";
      }
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case "user_not_confirmed": {
        return "Please confirm your email address to continue. Check your inbox for a confirmation email.";
      }
      case "invalid_credentials": {
        return "The email or password you entered is incorrect. Please try again.";
      }
      case "session_expired": {
        return "Your session has expired. Please log in again to continue.";
      }
      case "too_many_attempts": {
        return "Too many failed login attempts. Please try again later.";
      }
      default: {
        return (
          errorMessage || "An unexpected error occurred during authentication."
        );
      }
    }
  };

  const getActionText = () => {
    switch (errorType) {
      case "user_not_confirmed": {
        return "Go to Email Confirmation";
      }
      case "session_expired":
      case "invalid_credentials": {
        return "Go to Login";
      }
      default: {
        return "Try Again";
      }
    }
  };

  const getActionLink = () => 
    errorType === "user_not_confirmed" ? "/confirm-email" : "/login";

  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error/10">
            <svg
              className="h-6 w-6 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-center text-secondary-foreground">
            {getErrorTitle()}
          </h2>
          <p className="mt-4 text-secondary-foreground">
            {getErrorDescription()}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                globalThis.location.href = getActionLink();
              }}
              className="btn btn-primary w-full"
            >
              {getActionText()}
            </button>
            <button onClick={handleRetry} className="btn btn-ghost w-full mt-3">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
