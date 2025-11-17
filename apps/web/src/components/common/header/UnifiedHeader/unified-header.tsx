'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { HEADER_CONFIG } from '../header-config';
import { UnifiedNavigation } from '../UnifiedNavigation/unified-navigation';
import { useSession } from '@/controllers';

interface UnifiedHeaderProperties {
  variant?: 'marketing' | 'user' | 'dashboard';
  className?: string;
}

/**
 * Simplified unified header that replaces all previous header components
 * Handles both mobile and desktop views with unified navigation logic
 */
export default function UnifiedHeader({
  variant = 'marketing',
  className = '',
}: UnifiedHeaderProperties) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useSession();

  return (
    <header
      className={`bg-secondary text-secondary-foreground p-4 shadow-md sticky top-0 z-40 ${className}`}
    >
      {/* Desktop Header */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={HEADER_CONFIG.logo.src}
            alt={HEADER_CONFIG.logo.alt}
            width={HEADER_CONFIG.logo.width}
            height={HEADER_CONFIG.logo.height}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <UnifiedNavigation variant={variant} isLoggedIn={isAuthenticated} />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-accent"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col animate-in slide-in-from-right-full">
          {/* Mobile Header */}
          <div className="p-4 flex justify-between items-center border-b border-secondary">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src={HEADER_CONFIG.logo.src}
                alt={HEADER_CONFIG.logo.alt}
                width={160}
                height={50}
                priority
              />
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-accent"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            <UnifiedNavigation
              variant={variant}
              isLoggedIn={isAuthenticated}
              isMobile={true}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
