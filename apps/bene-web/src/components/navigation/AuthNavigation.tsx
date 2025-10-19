"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import AccountDropdown from "@/components/account/AccountDropdown";
import { ThemeToggle } from "../ui/ThemeToggle";

export function AuthNavigation() {
  const { user, isLoading } = useSession();

  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-10 w-20 bg-secondary rounded-md animate-pulse" />
        <div className="h-10 w-24 bg-primary rounded-md animate-pulse" />
      </div>
    );
  }

  // If user is logged in, show account dropdown
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/feed" className="btn btn-primary">
          Dashboard
        </Link>
        <AccountDropdown isLoggedIn={true} />
      </div>
    );
  }

  // If user is not logged in, show login/signup buttons
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className="btn btn-ghost text-lg px-4 py-2 border border-primary"
      >
        Login
      </Link>
      <Link href="/signup" className="btn btn-primary text-lg px-4 py-2">
        Sign Up
      </Link>
      <ThemeToggle />
    </div>
  );
}
