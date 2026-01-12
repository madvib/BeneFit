'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, LogoutButton, typography } from '@/lib/components';
import { HEADER_CONFIG } from '@/lib/components';

interface AccountSidebarProps {
  className?: string;
}

const AccountSidebar = ({ className }: AccountSidebarProps) => {
  const pathname = usePathname();

  return (
    <div className={`bg-muted/10 flex h-full flex-col ${className || ''}`}>
      <div className="p-6">
        <h2 className={`${typography.h3} tracking-tight`}>Settings</h2>
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>Manage your account</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {HEADER_CONFIG.navItems.account.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/user/account' && pathname.startsWith(`${item.href}/`));

          return (
            <Link key={item.href} href={item.href} prefetch={false} className="block">
              <Button
                variant="ghost"
                className={`w-full justify-start px-3 py-2 text-left ${
                  isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className={typography.labelSm}>{item.label}</span>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="border-muted/20 mt-auto border-t p-3">
        <LogoutButton
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
        />
      </div>
    </div>
  );
};

export default AccountSidebar;
