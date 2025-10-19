// Unified header configuration
export const HEADER_CONFIG = {
  // Logo configuration
  logo: {
    src: '/logo.svg',
    alt: 'BeneFit Logo',
    width: 200,
    height: 60,
  },

  // Marketing navigation links (shown to all users)
  marketingNavLinks: [
    { href: '/features', label: 'Features' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ],

  // Account navigation links (shown to logged-in users)
  accountNavLinks: [
    { href: '/account', label: 'Account' },
    { href: '/profile', label: 'Profile' },
    { href: '/connections', label: 'Connections' },
    { href: '/settings', label: 'Settings' },
  ],

  // Dashboard navigation links (shown to logged-in users)
  dashboardNavLinks: [
    { href: '/feed', label: 'Feeds' },
    { href: '/history', label: 'History' },
    { href: '/goals', label: 'Goals' },
    { href: '/plan', label: 'Plan' },
    { href: '/coach', label: 'Coach' },
  ],
};