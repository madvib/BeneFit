'use client';
import { useState, useRef, useEffect } from 'react';
import { CircleUser, ChevronDown } from 'lucide-react';
import NavigationLinks from '../navigation-links';
import { ThemeToggle } from '@/lib/components/theme';
import { LogoutButton } from '@/lib/components/auth';

interface UserAccountMenuProps {
  isLoggedIn: boolean;
  variant?: 'dropdown' | 'accordian';
}

export default function UserAccountMenu({
  isLoggedIn,
  variant = 'dropdown',
}: UserAccountMenuProps) {
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
    return false;
  }

  // Mobile accordion variant
  switch (variant) {
    case 'accordian':
      return (
        <div className="border-muted border-b">
          <button
            className="text-foreground hover:bg-accent flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors"
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
              <div className="text-foreground/70 flex items-center justify-between py-2 text-sm">
                <span>Theme</span>
                <ThemeToggle />
              </div>
              <div className="w-full py-2">
                <LogoutButton
                  variant="ghost"
                  className="text-foreground hover:bg-accent hover:text-accent-foreground block w-full px-4 py-2 text-left text-sm"
                />
              </div>
            </div>
          )}
        </div>
      );
    case 'dropdown':
      // Desktop dropdown variant
      return (
        <div className="relative" ref={dropdownReference}>
          <button
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md p-2 transition-colors sm:block"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Account menu"
            aria-expanded={dropdownOpen}
          >
            <CircleUser size={22} />
          </button>
          {dropdownOpen && (
            <div className="bg-background border-muted absolute right-0 z-50 mt-2 w-48 rounded-md border shadow-lg">
              <NavigationLinks variant="account" mobile={true} />
              <div className="text-foreground/70 flex items-center justify-between px-4 py-2 text-sm">
                <span>Theme</span>
                <ThemeToggle />
              </div>
              <div className="w-full px-4 py-2">
                <LogoutButton
                  variant="ghost"
                  className="text-foreground hover:bg-accent hover:text-accent-foreground block w-full px-4 py-2 text-left text-sm"
                />
              </div>
            </div>
          )}
        </div>
      );
  }
}
