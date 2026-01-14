import Link from 'next/link';
import { HEADER_CONFIG, type NavItem } from '@/lib/components';

export function NavigationLinks({
  mobile,
  variant,
}: {
  mobile: boolean;
  variant: 'marketing' | 'application' | 'account' | 'auth';
}) {
  const items = (): NavItem[] => {
    switch (variant) {
      case 'marketing':
        return HEADER_CONFIG.navItems.marketing;
      case 'application':
        return HEADER_CONFIG.navItems.application.filter((item) => !item.disabled);
      case 'account':
        return HEADER_CONFIG.navItems.account;
      case 'auth':
        return [];
    }
  };
  const linkClass = mobile
    ? 'block py-3 px-4 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-foreground/80'
    : 'hover:text-primary transition-colors hover:underline decoration-2 decoration-primary/50 underline-offset-8';
  return items()
    .filter((link) => !link.disabled)
    .map((link) => (
      <Link key={link.href} href={link.href} className={linkClass}>
        {link.label}
      </Link>
    ));
}
