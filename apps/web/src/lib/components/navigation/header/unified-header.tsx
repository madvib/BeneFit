
import {
  BeneLogo,
  HeaderLeft,
  HeaderRight,
  HeaderRoot,
  ThemeToggle,
  typography,
} from '@/lib/components';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '@bene/react-api-client';
import { useUI } from '@/lib/providers/ui-context';
import { UserAccountMenu } from '../account/account-dropdown/account-dropdown';
import { AuthCTA } from '../account/auth-cta';
import { DashboardLink } from '../links/dashboard-link';
import { MobileMenuToggle } from './mobile-menu-toggle';
import { NavigationLinks } from '../links/navigation-links';
import { DashboardNavigation } from './dashboard-navigation';

export function UnifiedHeader({
  variant,
  isLoggedIn: initialIsLoggedIn,
}: {
 readonly variant: 'marketing' | 'application' | 'auth';
 readonly isLoggedIn?: boolean;
}) {
  const [mobileMenuOpen, setMobileOpen] = useState(false);
  const { isAuthenticated: sessionAuthenticated } = useSession();
  const isAuthenticated = initialIsLoggedIn ?? sessionAuthenticated;
  const { isModalOpen } = useUI();
  const dashboardLink = () => {
    return variant === 'application' ? null : <DashboardLink />;
  };

  const logoHref = isAuthenticated ? '/user/activities' : '/';

  const mobileMenu = () => {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div className="bg-background border-muted animate-in slide-in-from-right absolute top-0 right-0 bottom-0 flex w-75 flex-col border-l p-6">
          <div className="mb-8 flex items-center justify-between">
            <BeneLogo href={logoHref} />
            <button onClick={() => setMobileOpen(false)}>
              <X className="text-muted-foreground h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            <NavigationLinks mobile={true} variant={variant} />
            {isAuthenticated ? (
              <div className={'flex-col gap-4 md:hidden'}>
                <UserAccountMenu isLoggedIn variant="accordian" />
                <div className="mx-auto mt-8 place-items-center-safe">{dashboardLink()}</div>
              </div>
            ) : (
              <div className="border-muted mt-6 flex flex-col gap-3 border-t pt-6">
                <ThemeToggle />

                <AuthCTA showModal={false} />
              </div>
            )}
          </nav>
        </div>
      </div>
    );
  };
  return (
    <>
      <HeaderRoot
        className={
          isModalOpen
            ? 'pointer-events-none opacity-50 blur-sm grayscale transition-all duration-300'
            : 'transition-all duration-300'
        }
      >
        <HeaderLeft>
          <div className="flex items-center gap-3 md:gap-6">
            <BeneLogo href={logoHref} />
            {variant !== 'application' && (
              <nav
                className={`${typography.p} text-muted-foreground ml-4 hidden items-center gap-8 md:flex`}
              >
                <NavigationLinks mobile={false} variant={variant} />
              </nav>
            )}
          </div>
        </HeaderLeft>

        {/* Center Navigation for Application Variant */}
        {variant === 'application' && (
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <DashboardNavigation />
          </div>
        )}

        <HeaderRight>
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <div className={'hidden items-center gap-4 md:flex'}>
                {dashboardLink()}
                <UserAccountMenu isLoggedIn={true} />
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <AuthCTA showModal={variant === 'marketing'} />
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
