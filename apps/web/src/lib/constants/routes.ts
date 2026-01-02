export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  FEATURES: '/features',

  // Auth routes (full page)
  AUTH: {
    CALLBACK: '/callback',
    CONFIRM_EMAIL: '/auth/confirm-email',
    EMAIL_CONFIRMED: '/auth/email-confirmed',
    LOGIN: '/auth/login',
    PASSWORD_RESET: '/auth/password-reset',
    SIGNUP: '/auth/signup',
    UPDATE_PASSWORD: '/auth/update-password',
  },

  // Modal routes (intercepting routes)
  MODAL: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    PASSWORD_RESET: '/password-reset',
  },

  // Protected routes
  USER: {
    ACCOUNT: '',
    ACTIVITIES: '/user/activities',
    BILLING: '/user/billing',
    COACH: '/user/coach',
    CONNECTIONS: '/user/connections',
    EXPLORE: '/user/explore',
    HISTORY: '/user/history',
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
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `${route}?${query}` : route;
}

// Usage examples:
// buildRoute(ROUTES.AUTH.LOGIN, { next: '/user/activities' })
// buildRoute(ROUTES.USER.PROFILE, { tab: 'settings' })
