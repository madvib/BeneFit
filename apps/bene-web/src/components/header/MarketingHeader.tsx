'use client';

import Link from 'next/link';
import PublicNav from '@/components/navigation/PublicNav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import BaseHeader from '@/components/header/BaseHeader';

const marketingNavLinks = [
  { href: '/features', label: 'Features' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export default function MarketingHeader({ className = '' }: { className?: string }) {
  return (
    <BaseHeader
      navLinks={marketingNavLinks}
      isLoggedIn={false}
      className={className}
    >
      <PublicNav isLoggedIn={false} />
      <div className="flex items-center gap-4">
        <Link href="/login" className="btn btn-ghost text-lg px-4 py-2 border border-primary">
          Login
        </Link>
        <Link href="/signup" className="btn btn-primary text-lg px-4 py-2">
          Sign Up
        </Link>
        <ThemeToggle />
      </div>
    </BaseHeader>
  );
}