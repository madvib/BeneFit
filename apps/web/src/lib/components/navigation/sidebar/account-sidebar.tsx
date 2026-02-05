
import { Button, HEADER_CONFIG, typography } from '@/lib/components';
import { LogoutButton } from '@/lib/components/auth/actions/logout-button/logout-button';
import { Link, useLocation } from '@tanstack/react-router';

interface AccountSidebarProps {
  className?: string;
}

export const AccountSidebar = ({ className }: AccountSidebarProps) => {
  const pathname = useLocation().pathname;

  return (
    <div className={`bg-muted/10 flex h-full flex-col ${className || ''}`}>
      <div className="p-6">
        <h2 className={typography.large}>Settings</h2>
        <p className={`${typography.small} text-muted-foreground`}>Manage your account</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {HEADER_CONFIG.navItems.account.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/user/account' && pathname.startsWith(`${item.href}/`));

          return (
            <Link key={item.href} to={item.href}  className="block">
              <Button
                variant="ghost"
                className={`w-full justify-start px-3 py-2 text-left ${
                  isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className={typography.p}>{item.label}</span>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="border-muted/20 mt-auto border-t p-3">
        <LogoutButton
          variant="ghost"
          className="w-full justify-start text-destructive/90 hover:bg-destructive/10 hover:text-destructive transition-colors"
        />
      </div>
    </div>
  );
};


