'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
  isLoggedIn: boolean;
}

const accountLinks = [
  { href: '/account', label: 'Account' },
  { href: '/profile', label: 'Profile' },
  { href: '/connections', label: 'Connections' },
  { href: '/settings', label: 'Settings' },
];

export default function MobileMenu({ isOpen, onClose, navLinks, isLoggedIn }: MobileMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col animate-in slide-in-from-right-full">
      <div className="p-4 flex justify-between items-center border-b border-secondary">
        <Link href="/" className="flex items-center" onClick={onClose}>
          <Image
            src="/logo.svg"
            alt="BeneFit Logo"
            width={160}
            height={50}
            priority
          />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <nav className="flex-1 flex flex-col items-center justify-center space-y-4 text-center py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-2xl font-medium text-foreground hover:text-primary"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <div className="w-1/2 my-4 border-t border-secondary" />
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-xl font-medium text-foreground/80 hover:text-primary"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-1/2 my-4 border-t border-secondary" />
              <LogoutButton variant="ghost" className="block py-2 text-xl font-medium text-foreground/80 hover:text-primary" />
            </>
          )}
        </nav>
        {!isLoggedIn && (
          <div className="flex flex-col space-y-2 p-4 border-t border-secondary">
            <Link href="/login" className="btn border border-secondary w-full text-center justify-center" onClick={onClose}>
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary w-full text-center justify-center" onClick={onClose}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
