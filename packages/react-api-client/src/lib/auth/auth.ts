import { createAuthClient } from 'better-auth/react';
import type { Session } from 'better-auth/types';

// Type definitions for Better Auth
export type AuthSession = Session;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

// 1. Create the client instance immediately
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  fetchOptions: {
    credentials: 'include',
  },
});

// 2. Export Helper Types
// Extract the error codes object type for type safety
export type AuthErrorCode = keyof typeof authClient.$ERROR_CODES;

export interface AuthErrorContext {
  showSignupLink?: boolean;
  showLoginLink?: boolean;
  showPasswordResetLink?: boolean;
  showPasswordRequirements?: boolean;
  requiresEmailVerification?: boolean;
  requiresReauth?: boolean;
  isRetryable?: boolean;
}

const AUTH_ERROR_METADATA: Record<AuthErrorCode, AuthErrorContext> = {
  // Password errors
  PASSWORD_TOO_LONG: { showPasswordRequirements: true },
  PASSWORD_TOO_SHORT: { showPasswordRequirements: true },

  // User not found
  ACCOUNT_NOT_FOUND: { showSignupLink: true },
  USER_NOT_FOUND: { showSignupLink: true },
  CREDENTIAL_ACCOUNT_NOT_FOUND: { showSignupLink: true },
  USER_EMAIL_NOT_FOUND: { showSignupLink: true },

  // Email verification
  EMAIL_NOT_VERIFIED: { requiresEmailVerification: true },

  // User already exists
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: { showLoginLink: true, showPasswordResetLink: true },
  USER_ALREADY_EXISTS: { showLoginLink: true, showPasswordResetLink: true },
  USER_ALREADY_HAS_PASSWORD: { showLoginLink: true, showPasswordResetLink: true },

  // Session expired
  SESSION_EXPIRED: { requiresReauth: true },

  // Invalid credentials
  INVALID_EMAIL: { showSignupLink: true, showPasswordResetLink: true },
  INVALID_EMAIL_OR_PASSWORD: { showSignupLink: true, showPasswordResetLink: true },
  INVALID_PASSWORD: { showSignupLink: true, showPasswordResetLink: true },

  // Network/server errors
  FAILED_TO_CREATE_SESSION: { isRetryable: true },
  FAILED_TO_CREATE_USER: { isRetryable: true },
  FAILED_TO_GET_SESSION: { isRetryable: true },
  FAILED_TO_GET_USER_INFO: { isRetryable: true },
  FAILED_TO_UNLINK_LAST_ACCOUNT: { isRetryable: true },
  FAILED_TO_UPDATE_USER: { isRetryable: true },

  // Other errors
  EMAIL_CAN_NOT_BE_UPDATED: {},
  ID_TOKEN_NOT_SUPPORTED: {},
  INVALID_TOKEN: {},
  PROVIDER_NOT_FOUND: {},
  SOCIAL_ACCOUNT_ALREADY_LINKED: {},
} as const;

const AUTH_ERROR_CODE_SET = new Set<AuthErrorCode>(
  Object.keys(AUTH_ERROR_METADATA) as AuthErrorCode[],
);

export function isAuthErrorCode(code: string): code is AuthErrorCode {
  return AUTH_ERROR_CODE_SET.has(code as AuthErrorCode);
}

export function getAuthErrorContext(errorCode: string): AuthErrorContext {
  if (!isAuthErrorCode(errorCode)) {
    return {};
  }

  return AUTH_ERROR_METADATA[errorCode];
}

// 3. Centralized Error Message Helper
export function getAuthErrorMessage(code: string | undefined | null): string {
  if (!code) return 'An unknown error occurred.';

  // We can map specific codes to user-friendly messages here
  // For now, we'll format the code nicely, but this grows as we need translations
  const messages: Record<string, string> = {
    INVALID_CREDENTIALS: 'The email or password you entered is incorrect.',
    USER_ALREADY_EXISTS: 'An account with this email already exists.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    FAILED_TO_CREATE_SESSION: 'Could not start your session. Please try again.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address to continue.',
  };

  return messages[code] || messages[code.toUpperCase()] || formatErrorCode(code);
}

function formatErrorCode(code: string): string {
  // Turn "USER_NOT_FOUND" into "User Not Found"
  return code
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
