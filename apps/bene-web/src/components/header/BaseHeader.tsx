'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';

export interface NavLink {
  href: string;
  label: string;
}

export interface BaseHeaderProps {
  children: React.ReactNode;
  navLinks: NavLink[];
  isLoggedIn: boolean;
  className?: string;
}

export default function BaseHeader({
  children,
  navLinks,
  isLoggedIn,
  className = '',
}: BaseHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header
        className={`bg-secondary text-secondary-foreground p-4 shadow-md sticky top-0 z-40 ${className}`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="BeneFit Logo"
              width={200}
              height={60}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">{children}</div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-accent"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}