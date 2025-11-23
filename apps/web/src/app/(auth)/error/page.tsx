'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ErrorPage } from '@/components';

export default function AuthErrorPage() {
  const searchParameters = useSearchParams();

  const { errorType, errorMessage } = useMemo(() => {
    const error = searchParameters.get('error');
    const error_description = searchParameters.get('error_description');

    return {
      errorType: error || undefined,
      errorMessage: error_description || 'An authentication error occurred',
    };
  }, [searchParameters]);

  const getErrorTitle = () => {
    switch (errorType) {
      case 'user_not_confirmed': {
        return 'Email Not Confirmed';
      }
      case 'invalid_credentials': {
        return 'Invalid Credentials';
      }
      case 'session_expired': {
        return 'Session Expired';
      }
      case 'too_many_attempts': {
        return 'Too Many Attempts';
      }
      default: {
        return 'Authentication Error';
      }
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case 'user_not_confirmed': {
        return 'Please confirm your email address to continue. Check your inbox for a confirmation email.';
      }
      case 'invalid_credentials': {
        return 'The email or password you entered is incorrect. Please try again.';
      }
      case 'session_expired': {
        return 'Your session has expired. Please log in again to continue.';
      }
      case 'too_many_attempts': {
        return 'Too many failed login attempts. Please try again later.';
      }
      default: {
        return errorMessage || 'An unexpected error occurred during authentication.';
      }
    }
  };

  const getActionLink = () =>
    errorType === 'user_not_confirmed' ? '/confirm-email' : '/login';

  return (
    <div className="container mx-auto p-8">
      <ErrorPage
        title={getErrorTitle()}
        message={getErrorDescription()}
        error={errorMessage}
        showBackButton={true}
        showRefreshButton={true}
        showReportButton={false}
        backHref={getActionLink()}
      />
    </div>
  );
}
