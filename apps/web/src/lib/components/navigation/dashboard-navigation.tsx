'use client';

import { HEADER_CONFIG } from '@/lib/components/header/primitives/header-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/50 border-border/50 hover:border-primary/20 hover:shadow-primary/5 relative flex items-center gap-1 rounded-full border p-1 shadow-sm backdrop-blur-md transition-all">
      {HEADER_CONFIG.navItems.application
        .filter((item) => !item.disabled)
        .map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {isActive && (
                <div className="bg-primary absolute inset-0 rounded-full shadow-sm transition-all duration-300 ease-out" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={14} className={isActive ? 'animate-pulse' : ''} />
                <span className={isActive ? '' : 'hidden lg:inline'}>{item.label}</span>
              </span>
            </Link>
          );
        })}
    </nav>
  );
}
