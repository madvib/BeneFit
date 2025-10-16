'use client';

import DashboardNav from '@/components/navigation/DashboardNav';
import AccountDropdown from '@/components/account/AccountDropdown';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import BaseHeader from '@/components/header/BaseHeader';

const userNavLinks = [
  { href: '/feed', label: 'Feeds' },
  { href: '/history', label: 'History' },
  { href: '/goals', label: 'Goals' },
  { href: '/plan', label: 'Plan' },
  { href: '/coach', label: 'Coach' },
];

export default function UserHeader({ className = '' }: { className?: string }) {
  return (
    <BaseHeader
      navLinks={userNavLinks}
      isLoggedIn={true}
      className={className}
    >
      <DashboardNav items={userNavLinks} />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <AccountDropdown isLoggedIn={true} />
      </div>
    </BaseHeader>
  );
}