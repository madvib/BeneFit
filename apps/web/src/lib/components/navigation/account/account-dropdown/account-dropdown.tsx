import { useState, useRef, useEffect } from 'react';
import { CircleUser, ChevronDown } from 'lucide-react';
import { Dropdown, typography } from '@/lib/components';
import { LogoutButton } from '@/lib/components/auth/actions/logout-button/logout-button';
import { ThemeToggle } from '@/lib/components/theme/theme-toggle/theme-toggle';
import { NavigationLinks } from '../../links/navigation-links';
interface UserAccountMenuProps {
  isLoggedIn: boolean;
  variant?: 'dropdown' | 'accordian';
}

export function UserAccountMenu({
  isLoggedIn,
  variant = 'dropdown',
}: Readonly<UserAccountMenuProps>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownReference = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    if (variant === 'accordian') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownReference.current &&
        !dropdownReference.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [variant]);

  if (!isLoggedIn) {
    return null;
  }

  // Mobile accordion variant
  switch (variant) {
    case 'accordian':
      return (
        <div className="border-muted border-b">
          <button
            className={`${typography.p} text-foreground hover:bg-accent flex w-full items-center justify-between px-4 py-3 transition-colors`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Account menu"
            aria-expanded={dropdownOpen}
          >
            <div className="flex items-center gap-3">
              <CircleUser size={20} />
              <span>Account</span>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {dropdownOpen && (
            <div className="bg-background px-4 pb-2">
              <NavigationLinks variant="account" mobile={true} />
              <div
                className={`${typography.p} text-foreground/70 flex items-center justify-between py-2`}
              >
                <span>Theme</span>
                <ThemeToggle />
              </div>
              <div className="w-full py-2">
                <LogoutButton
                  variant="ghost"
                  className="text-destructive/90 hover:bg-destructive/10 dark:hover:bg-destructive/20 hover:text-destructive w-full justify-start px-4 py-2 transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      );
    case 'dropdown':
      // Desktop dropdown variant
      return (
        <Dropdown.Root openOnHover>
          <Dropdown.Trigger className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors sm:block">
            <CircleUser size={22} />
          </Dropdown.Trigger>

          <Dropdown.Content width="w-48">
            <div className="px-1 py-1">
              {/* NavigationLinks renders list items, we wrap them or refactor NavigationLinks?
                    NavigationLinks renders <ul><li><Link> so it might break the button structure of Dropdown.Item.
                    Let's check NavigationLinks content. If it's complex, we might just put it in a div inside Content.
                */}
              <div className="border-border/50 mb-2 border-b px-2 pt-1 pb-2">
                <NavigationLinks variant="account" mobile={true} />
              </div>

              <div
                className={`${typography.small} text-foreground/70 flex items-center justify-between px-3 py-2`}
              >
                <span>Theme</span>
                <ThemeToggle />
              </div>

              <div className="border-border/50 mt-1 border-t pt-2">
                <LogoutButton
                  variant="ghost"
                  className="text-destructive/90 hover:bg-destructive/10 dark:hover:bg-destructive/20 hover:text-destructive w-full justify-start px-2 py-2 transition-colors"
                />
              </div>
            </div>
          </Dropdown.Content>
        </Dropdown.Root>
      );
  }
}
