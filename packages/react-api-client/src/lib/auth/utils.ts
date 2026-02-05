/**
 * Shared authentication utilities for react-api-client
 */

/**
 * Retrieves the authentication token from localStorage if available.
 * Defaults to an empty string if not in a browser environment.
 */
export const getToken = (): string => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem('token') || '';
  }
  return '';
};
