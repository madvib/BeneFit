'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import DashboardNav from '@/components/dashboard/DashboardNav';
import AccountDropdown from '@/components/AccountDropdown';
import PublicNav from '@/components/PublicNav';

type HeaderProps = {
  variant?: 'marketing' | 'user';
};

export default function Header({ variant = 'marketing' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderUserNav = () => (
    <>
      <nav className="hidden md:flex flex-col md:flex-row gap-4">
        <DashboardNav 
          items={[
            { href: '/feed', label: 'Feeds' },
            { href: '/history', label: 'History' },
            { href: '/goals', label: 'Goals' },
            { href: '/plan', label: 'Plan' },
            { href: '/coach', label: 'Coach' }
          ]} 
        />
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <AccountDropdown isLoggedIn={true} />
        </div>
      </nav>
      <div className="hidden md:flex items-center gap-4">
        <ThemeToggle />
        <AccountDropdown isLoggedIn={true} />
      </div>
    </>
  );

  const renderPublicNav = () => (
    <>
      <nav className="hidden md:flex gap-4">
        <PublicNav isLoggedIn={false} />
        <ThemeToggle />
        <Link href="/login" className="btn btn-secondary">
          Login
        </Link>
      </nav>
    </>
  );

  const renderMobileMenu = () => (
    <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-secondary">
        <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <Image
            src="/logo.svg"
            alt="BeneFit Logo"
            width={130}
            height={45}
            priority
          />
        </Link>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-accent"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 flex flex-col p-4 space-y-6">
        {variant === 'user' ? (
          <>
            <Link href="/feed" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Feeds
            </Link>
            <Link href="/history" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              History
            </Link>
            <Link href="/goals" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Goals
            </Link>
            <Link href="/plan" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Plan
            </Link>
            <Link href="/coach" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Coach
            </Link>
          </>
        ) : (
          <>
            <Link href="/features" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link href="/about" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/blog" className="block py-3 text-lg" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
          </>
        )}
        <div className="mt-auto pt-6 space-y-4">
          <div className="flex items-center gap-4 justify-center">
            <ThemeToggle />
          </div>
          {variant === 'user' ? (
            <AccountDropdown isLoggedIn={true} />
          ) : (
            <div className="text-center">
              <Link 
                href="/login" 
                className="btn btn-secondary w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="bg-secondary text-secondary-foreground p-4 shadow-md sticky top-0 z-40">
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
          
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-accent"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex">
              {variant === 'user' ? renderUserNav() : renderPublicNav()}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && renderMobileMenu()}
    </>
  );
}