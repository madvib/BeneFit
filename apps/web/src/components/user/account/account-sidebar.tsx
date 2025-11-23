'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components';
import {
  User,
  Settings,
  CreditCard,
  Link as LinkIcon,
  Shield,
  Bell,
} from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button/logout-button';

interface AccountSidebarProps {
  className?: string;
}

const AccountSidebar = ({ className }: AccountSidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Profile',
      href: '/user/account/profile',
      description: 'Manage your profile information',
      icon: User,
    },
    {
      title: 'Account Settings',
      href: '/user/account',
      description: 'Update personal information and security',
      icon: Shield,
    },
    {
      title: 'Billing & Plans',
      href: '/user/account/billing',
      description: 'Manage subscription and payment methods',
      icon: CreditCard,
    },
    {
      title: 'Notifications',
      href: '/user/account/notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
    },
    {
      title: 'Preferences',
      href: '/user/account/settings',
      description: 'Notification, privacy, and fitness settings',
      icon: Settings,
    },
    {
      title: 'Connections',
      href: '/user/account/connections',
      description: 'Manage connected services',
      icon: LinkIcon,
    },
  ];

  return (
    <div className={`bg-muted/10 flex h-full flex-col ${className || ''}`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your account</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/user/account' && pathname.startsWith(`${item.href}/`));

          return (
            <Link key={item.href} href={item.href} prefetch={false} className="block">
              <Button
                variant="ghost"
                className={`w-full justify-start px-3 py-2 text-left ${
                  isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="font-medium">{item.title}</span>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="border-muted/20 mt-auto border-t p-3">
        <LogoutButton
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
        />
      </div>
    </div>
  );
};

export default AccountSidebar;
