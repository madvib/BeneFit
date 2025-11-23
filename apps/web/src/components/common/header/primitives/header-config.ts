// Unified header configuration
export const HEADER_CONFIG = {
  // Logo configuration
  logo: {
    src: '/logo.svg',
    alt: 'BeneFit Logo',
    width: 200,
    height: 60,
  },
  navItems: {
    // Marketing navigation links (shown to all users)
    marketing: [
      { href: '/features', label: 'Features' },
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' },
    ],

    // Account navigation links (shown to logged-in users)
    account: [
      { href: '/user/account', label: 'Account' },
      { href: '/user/account/profile', label: 'Profile' },
      { href: '/user/account/connections', label: 'Connections' },
      { href: '/user/account/settings', label: 'Settings' },
    ],

    // Dashboard navigation links (shown to logged-in users)
    dashboard: [
      { href: '/user/activity-feed', label: 'Activity Feed' },
      { href: '/user/history', label: 'History' },
      { href: '/user/goals', label: 'Goals' },
      { href: '/user/plan', label: 'Plan' },
      { href: '/user/coach', label: 'Coach' },
    ],
  },
};
