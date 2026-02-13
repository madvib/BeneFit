import { createAuthClient } from 'better-auth/react';
import type { Session } from 'better-auth/types';
import { getConfig } from '../config/runtime';

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

// Singleton cache - null until first access
let _authClientInstance: ReturnType<typeof createAuthClient> | null = null;

/**
 * Get or create the auth client singleton.
 * Lazy initialization on first call.
 *
 * This function reads the base URL from runtime configuration
 * (set by the consuming app via initializeApiClients).
 */
export function getAuthClient(): ReturnType<typeof createAuthClient> {
  if (!_authClientInstance) {
    const config = getConfig();
    _authClientInstance = createAuthClient({
      baseURL: config.baseUrl,
      fetchOptions: {
        credentials: 'include',
      },
    });
  }
  return _authClientInstance;
}

/**
 * Reset the auth client singleton.
 * Useful for testing or environment switching.
 */
export function resetAuthClient(): void {
  _authClientInstance = null;
}

/**
 * Auth client - simple re-export of getAuthClient for convenience.
 * Call this function to get the auth client: authClient()
 */
export const authClient = getAuthClient;

// 2. Export Helper Types
// Extract the error codes object type for type safety
export type AuthErrorCode = keyof ReturnType<typeof createAuthClient>['$ERROR_CODES'];

export interface AuthErrorContext {
  message?: string;
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
  PASSWORD_TOO_LONG: { showPasswordRequirements: true, message: 'Password is too long.' },
  PASSWORD_TOO_SHORT: { showPasswordRequirements: true, message: 'Password is too short.' },

  // User not found
  ACCOUNT_NOT_FOUND: {
    showSignupLink: true,
    message: 'An account with this email was not found.',
  },
  USER_NOT_FOUND: { showSignupLink: true, message: 'The specified user was not found.' },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    showSignupLink: true,
    message: 'No password-based account found for this email.',
  },
  USER_EMAIL_NOT_FOUND: { showSignupLink: true, message: 'Email address not found.' },

  // Email verification
  EMAIL_NOT_VERIFIED: {
    requiresEmailVerification: true,
    message: 'Please verify your email address to continue.',
  },

  // User already exists
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    showLoginLink: true,
    showPasswordResetLink: true,
    message: 'An account with this email already exists.',
  },
  USER_ALREADY_EXISTS: {
    showLoginLink: true,
    showPasswordResetLink: true,
    message: 'An account with this email already exists.',
  },
  USER_ALREADY_HAS_PASSWORD: {
    showLoginLink: true,
    showPasswordResetLink: true,
    message: 'This account already has a password set.',
  },

  // Session expired
  SESSION_EXPIRED: {
    requiresReauth: true,
    message: 'Your session has expired. Please log in again.',
  },

  // Invalid credentials
  INVALID_EMAIL: {
    showSignupLink: true,
    showPasswordResetLink: true,
    message: 'The email address provided is invalid.',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    showSignupLink: true,
    showPasswordResetLink: true,
    message: 'The email or password you entered is incorrect.',
  },
  INVALID_PASSWORD: {
    showSignupLink: true,
    showPasswordResetLink: true,
    message: 'The password you entered is incorrect.',
  },

  // Network/server errors
  FAILED_TO_CREATE_SESSION: {
    isRetryable: true,
    message: 'Could not start your session. Please try again.',
  },
  FAILED_TO_CREATE_USER: {
    isRetryable: true,
    message: 'Failed to create your account. Please try again.',
  },
  FAILED_TO_GET_SESSION: { isRetryable: true, message: 'Failed to retrieve your session data.' },
  FAILED_TO_GET_USER_INFO: { isRetryable: true },
  FAILED_TO_UNLINK_LAST_ACCOUNT: { isRetryable: true },
  FAILED_TO_UPDATE_USER: {
    isRetryable: true,
    message: 'Failed to update your profile. Please try again.',
  },

  // Other errors
  EMAIL_CAN_NOT_BE_UPDATED: { message: 'Email address cannot be changed at this time.' },
  ID_TOKEN_NOT_SUPPORTED: {},
  INVALID_TOKEN: { message: 'The provided token is invalid or has expired.' },
  PROVIDER_NOT_FOUND: {},
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    message: 'This social account is already linked to another user.',
  },
  CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: { message: 'Login blocked due to cross-site navigation.' },
  VERIFICATION_EMAIL_NOT_ENABLED: {},
  EMAIL_ALREADY_VERIFIED: { message: 'This email address is already verified.' },
  EMAIL_MISMATCH: { message: 'The emails provided do not match.' },
  MISSING_FIELD: { message: 'A required field is missing.' },
  VALIDATION_ERROR: { message: 'One or more fields failed validation.' },
  ASYNC_VALIDATION_NOT_SUPPORTED: {},
  SESSION_NOT_FRESH: {
    requiresReauth: true,
    message: 'For security, please re-authenticate to complete this action.',
  },
  CALLBACK_URL_REQUIRED: {},
  FAILED_TO_CREATE_VERIFICATION: { isRetryable: true },
  MISSING_OR_NULL_ORIGIN: {},
  LINKED_ACCOUNT_ALREADY_EXISTS: { message: 'This account is already linked.' },
  INVALID_REDIRECT_URL: {},
  INVALID_ORIGIN: {},
  INVALID_NEW_USER_CALLBACK_URL: {},
  INVALID_ERROR_CALLBACK_URL: {},
  INVALID_CALLBACK_URL: {},
  FIELD_NOT_ALLOWED: {},
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

  // Normalize code (better-auth codes are usually uppercase)
  const normalizedCode = code.toUpperCase();

  // 1. Try to get message from metadata
  return getAuthErrorContext(normalizedCode).message || formatErrorCode(normalizedCode);
}

function formatErrorCode(code: string): string {
  // Turn "USER_NOT_FOUND" into "User Not Found"
  return code
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
