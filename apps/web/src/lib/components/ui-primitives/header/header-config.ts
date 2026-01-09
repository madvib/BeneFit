import {
  LayoutDashboard,
  Activity,
  Users,
  Compass,
  MessageSquare,
  User,
  Settings,
  CreditCard,
  Link as LinkIcon,
  Shield,
  Bell,
  UserPlus,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const HEADER_CONFIG = {
  // Logo configuration
  logo: {
    src: '/logo.svg',
    alt: 'BeneFit Logo',
    width: 200,
    height: 60,
  },
  navItems: {
    auth: [
      {
        href: '/login',
        label: 'Login',
        description: 'Login to your account',
        icon: User,
      },
      {
        href: '/signup',
        label: 'Sign Up',
        description: 'Sign up to create an account',
        icon: UserPlus,
      },
    ],
    // Marketing navigation links (shown to all users)
    marketing: [
      {
        href: '/features',
        label: 'Features',
        description: 'View our features',
        icon: Activity,
      },

      { href: '/about', label: 'About', description: 'Learn about us', icon: User },
    ],
    // Account navigation links (shown to logged-in users)
    account: [
      {
        label: 'Profile',
        href: '/user/profile',
        description: 'Manage your profile information',
        icon: User,
      },
      {
        label: 'Connections',
        href: '/user/connections',
        description: 'Manage connected services',
        icon: LinkIcon,
      },
      {
        label: 'Account Settings',
        href: '/user/account',
        description: 'Update personal information and security',
        icon: Shield,
      },
      {
        label: 'Billing & Plans',
        href: '/user/billing',
        description: 'Manage subscription and payment methods',
        icon: CreditCard,
      },
      {
        label: 'Notifications',
        href: '/user/notifications',
        description: 'Manage your notification preferences',
        icon: Bell,
      },
      {
        label: 'Preferences',
        href: '/user/settings',
        description: 'Notification, privacy, and fitness settings',
        icon: Settings,
      },
    ],

    // Dashboard navigation links (shown to logged-in users)
    application: [
      {
        label: 'Activity',
        href: '/user/activities',
        icon: Activity,
        description: 'View your activity feed',
      },
      {
        label: 'My Plan',
        href: '/user/plan',
        icon: LayoutDashboard,
        description: 'View your plan',
      },
      {
        label: 'Teams',
        href: '/user/teams',
        icon: Users,
        description: 'View your teams',
        disabled: true,
      },
      {
        label: 'Explore',
        href: '/user/explore',
        icon: Compass,
        description: 'Explore new activities',
        disabled: true,
      },
      {
        label: 'Coach',
        href: '/user/coach',
        icon: MessageSquare,
        description: 'Chat with your coach',
      },
    ],
  },
};
