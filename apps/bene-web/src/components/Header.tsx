'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import DashboardNav from '@/components/dashboard/DashboardNav';
import AccountDropdown from '@/components/AccountDropdown';
import PublicNav from '@/components/PublicNav';

type HeaderProps = {
  variant?: 'marketing' | 'user';
};

export default function Header({ variant = 'marketing' }: HeaderProps) {
  return (
    <header className="bg-secondary text-secondary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="BeneFit Logo"
            width={150}
            height={50}
            priority
          />
        </Link>
        
        {variant === 'user' ? (
          <div className="flex items-center gap-4">
            <DashboardNav 
              items={[
                { href: '/feed', label: 'Feeds' },
                { href: '/history', label: 'History' },
                { href: '/goals', label: 'Goals' },
                { href: '/plan', label: 'Plan' },
                { href: '/coach', label: 'Coach' }
              ]} 
            />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <AccountDropdown isLoggedIn={true} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <PublicNav isLoggedIn={false} />
            <ThemeToggle />
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}