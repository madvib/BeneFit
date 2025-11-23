'use client';
import { X } from 'lucide-react';
import { useState } from 'react';
import { HeaderLeft, HeaderRight } from './primitives/sections';
import HeaderRoot from './primitives/header-root';
import { useSession } from '@/controllers';
import { BeneLogo } from '../ui-primitives/logo/logo';
import { ThemeToggle } from '@/components/theme/theme-toggle/theme-toggle';
import UserAccountMenu from '@/components/common/header/navigation/account-dropdown/account-dropdown';
import AuthCTA from './navigation/auth-cta';
import DashboardLink from './navigation/dashboard-link';
import MobileMenuToggle from './navigation/mobile-menu-toggle';
import NavigationLinks from './navigation/navigation-links';

export default function UnifiedHeader({
  variant,
}: {
  variant: 'marketing' | 'application';
}) {
  const [mobileMenuOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useSession();
  const dashboardLink = () => {
    return variant === 'marketing' ? <DashboardLink /> : null;
  };

  const mobileMenu = () => {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div className="bg-background border-muted animate-in slide-in-from-right absolute top-0 right-0 bottom-0 flex w-[300px] flex-col border-l p-6">
          <div className="mb-8 flex items-center justify-between">
            <BeneLogo />
            <button onClick={() => setMobileOpen(false)}>
              <X className="text-muted-foreground h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            <NavigationLinks mobile={true} variant={variant} />
            {isAuthenticated ? (
              <div className={'flex-col gap-4 md:hidden'}>
                <UserAccountMenu isLoggedIn variant="accordian" />
                <div className="mx-auto mt-8 place-items-center-safe">
                  {dashboardLink()}
                </div>
              </div>
            ) : (
              <div className="border-muted mt-6 flex flex-col gap-3 border-t pt-6">
                <ThemeToggle />

                <AuthCTA />
              </div>
            )}
          </nav>
        </div>
      </div>
    );
  };
  return (
    <>
      <HeaderRoot>
        <HeaderLeft>
          <div className="flex items-center gap-3 md:gap-6">
            <BeneLogo />
            <nav className="text-muted-foreground ml-4 hidden items-center gap-8 text-sm font-medium md:flex">
              <NavigationLinks mobile={false} variant={variant} />
            </nav>
          </div>
        </HeaderLeft>
        <HeaderRight>
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <div className={'hidden items-center gap-4 md:flex'}>
                {dashboardLink()}
                <UserAccountMenu isLoggedIn={true} />
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <AuthCTA />
                <ThemeToggle />
              </div>
            )}
            <MobileMenuToggle openMenu={() => setMobileOpen(true)} />
          </div>
        </HeaderRight>
      </HeaderRoot>
      {mobileMenuOpen && mobileMenu()}
    </>
  );
}
