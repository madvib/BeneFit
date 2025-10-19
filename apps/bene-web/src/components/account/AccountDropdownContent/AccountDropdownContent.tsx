"use client";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle/ThemeToggle";

interface AccountDropdownContentProps {
  onItemClick?: () => void;
  showThemeToggle?: boolean;
  showLogoutButton?: boolean;
}

export default function AccountDropdownContent({
  onItemClick,
  showThemeToggle = true,
  showLogoutButton = true,
}: AccountDropdownContentProps) {
  return (
    <div className="py-1">
      <Link
        href="/account"
        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={onItemClick}
      >
        Account
      </Link>
      <Link
        href="/profile"
        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={onItemClick}
      >
        Profile
      </Link>
      <Link
        href="/connections"
        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={onItemClick}
      >
        Connections
      </Link>
      <Link
        href="/settings"
        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={onItemClick}
      >
        Settings
      </Link>
      {showThemeToggle && (
        <div className="px-4 py-2 text-sm text-foreground/70 flex items-center justify-between">
          <span>Theme</span>
          <ThemeToggle />
        </div>
      )}
      {showLogoutButton && (
        <div className="px-4 py-2 w-full">
          <LogoutButton
            variant="ghost"
            onItemClick={onItemClick}
            className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
          />
        </div>
      )}
    </div>
  );
}
