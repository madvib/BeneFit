'use client';

import Link from 'next/link';
import { HEADER_CONFIG } from '../header-config';
import { ThemeToggle } from '@/components/theme/theme-toggle/theme-toggle';
import { AccountDropdown } from '@/components';
import AccountDropdownContent from '@/components/user/account/account-dropdown-content/account-dropdown-content';

interface UnifiedNavigationProperties {
  variant: 'marketing' | 'user' | 'dashboard';
  isLoggedIn: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

/**
 * Unified navigation component that works for both mobile and desktop
 * Shows appropriate links based on context while providing access to dashboard for logged-in users
 */
export function UnifiedNavigation({
  variant,
  isLoggedIn,
  isMobile = false,
  onClose,
}: UnifiedNavigationProperties) {
  // Handle click events
  const handleClick = () => {
    if (onClose) onClose();
  };

  // Render navigation links
  const renderLinks = (
    links: { href: string; label: string }[],
    size: 'normal' | 'large' = 'normal',
  ) => {
    const textSize = size === 'large' ? '2xl' : 'xl';
    const linkClass = isMobile
      ? `block py-2 text-${textSize} font-medium text-foreground hover:text-primary`
      : `px-4 py-3 font-semibold border-b-2 border-transparent hover:border-secondary-foreground hover:text-secondary-foreground`;

    return links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={linkClass}
        onClick={handleClick}
      >
        {link.label}
      </Link>
    ));
  };

  // Render auth section
  const renderAuthSection = () => {
    if (isLoggedIn) {
      return (
        <div className={`flex items-center gap-4 ${isMobile ? 'flex-col' : ''}`}>
          {isMobile ? (
            <AccountDropdownContent
              onItemClick={handleClick}
              showThemeToggle={true}
              showLogoutButton={true}
            />
          ) : (
            <AccountDropdown isLoggedIn={true} />
          )}
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-4 ${isMobile ? 'flex-col w-full' : ''}`}>
        <Link
          href="/login"
          className={`btn ${isMobile ? 'w-full' : ''} btn-ghost text-lg px-4 py-2 border border-primary`}
          onClick={handleClick}
        >
          Login
        </Link>
        <Link
          href="/signup"
          className={`btn ${isMobile ? 'w-full' : ''} btn-primary text-lg px-4 py-2`}
          onClick={handleClick}
        >
          Sign Up
        </Link>
        <ThemeToggle />
      </div>
    );
  };

  // Mobile view
  if (isMobile) {
    return (
      <nav className="flex-1 flex flex-col items-center justify-center space-y-4 text-center py-4">
        {/* Marketing pages - only shown on marketing variant */}
        {variant === 'marketing' &&
          renderLinks(HEADER_CONFIG.marketingNavLinks, 'large')}

        {/* Dashboard links - only shown on dashboard variant */}
        {variant === 'dashboard' && isLoggedIn && (
          <>
            {renderLinks(HEADER_CONFIG.dashboardNavLinks, 'large')}
            <div className="w-1/2 my-4 border-t border-secondary" />
          </>
        )}

        {/* Dashboard link for logged-in users on marketing pages */}
        {variant === 'marketing' && isLoggedIn && (
          <>
            <div className="w-1/2 my-4 border-t border-secondary" />
            <Link
              href="/feed"
              className="block py-2 text-2xl font-medium text-foreground hover:text-primary"
              onClick={handleClick}
            >
              Dashboard
            </Link>
            <div className="w-1/2 my-4 border-t border-secondary" />
          </>
        )}

        {/* Auth section */}

        {renderAuthSection()}
      </nav>
    );
  }

  // Desktop view
  return (
    <div className="flex items-center gap-4">
      {/* Marketing links - only shown on marketing variant */}
      {variant === 'marketing' && (
        <div className="hidden md:flex flex-wrap">
          {renderLinks(HEADER_CONFIG.marketingNavLinks)}
        </div>
      )}

      {/* Dashboard links - only shown on dashboard variant */}
      {variant === 'dashboard' && isLoggedIn && (
        <div className="hidden md:flex flex-wrap">
          {renderLinks(HEADER_CONFIG.dashboardNavLinks)}
        </div>
      )}

      {/* Dashboard link for logged-in users on marketing pages */}
      {variant === 'marketing' && isLoggedIn && (
        <Link
          href="/feed"
          className={`btn ${isMobile ? 'w-full' : ''} btn-primary text-lg px-4 py-2`}
          onClick={handleClick}
        >
          Dashboard
        </Link>
      )}

      {/* Auth section */}
      {renderAuthSection()}
    </div>
  );
}
