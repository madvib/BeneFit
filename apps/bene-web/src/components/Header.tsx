'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import DashboardNav from '@/components/dashboard/DashboardNav';
import AccountDropdown from '@/components/AccountDropdown';
import PublicNav from '@/components/PublicNav';
import { usePathname } from 'next/navigation';

type HeaderProps = {
  isLoggedIn?: boolean;
};

export default function Header({ isLoggedIn = false }: HeaderProps) {
  const pathname = usePathname();

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
        
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <DashboardNav 
              items={[
                { href: '/dashboard', label: 'Feeds' },
                { href: '/dashboard/history', label: 'History' },
                { href: '/dashboard/goals', label: 'Goals' },
                { href: '/dashboard/plan', label: 'Plan' },
                { href: '/dashboard/coach', label: 'Coach' }
              ]} 
            />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <AccountDropdown isLoggedIn={isLoggedIn} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <PublicNav isLoggedIn={isLoggedIn} />
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