export const MODALS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  RESET_PASSWORD: 'reset-password',
  UPDATE_PASSWORD: 'update-password',
  CONFIRM_EMAIL: 'confirm-email',
  VERIFY_EMAIL: 'verify-email',
};
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  FEATURES: '/features',
  ONBOARDING: '/onboarding',

  // Auth routes (full page)
  AUTH: {
    CALLBACK: '/callback',
    EMAIL_CONFIRMED: '/email-confirmed',
    LOGIN: '/login',
    SIGNUP: '/signup',
  },

  // Modal routes (intercepting routes)
  MODAL: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    PASSWORD_RESET: '/password-reset', // eslint-disable-line sonarjs/no-hardcoded-passwords
  },

  // Protected routes
  USER: {
    ACCOUNT: '',
    ACTIVITIES: '/user/activities',
    BILLING: '/user/billing',
    COACH: '/user/coach',
    CONNECTIONS: '/user/connections',
    EXPLORE: '/user/explore',
    NOTIFICATIONS: '/user/notifications',
    PLAN: '/user/plan',
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    TODAY: '/user/today',
  },
} as const;

// Helper to build URLs with query params
export function buildRoute(route: string, params?: Record<string, string | number | undefined>) {
  if (!params) return route;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `${route}?${query}` : route;
}

// Usage examples:
// buildRoute(ROUTES.AUTH.LOGIN, { next: '/user/activities' })
// buildRoute(ROUTES.USER.PROFILE, { tab: 'settings' })
