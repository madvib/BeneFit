'use client';

import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function MobileAuthNavigation({ onClose }: { onClose: () => void }) {
  const { user, isLoading } = useSession();

  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2 p-4 border-t border-secondary">
        <div className="h-10 w-full bg-secondary rounded-md animate-pulse" />
        <div className="h-10 w-full bg-primary rounded-md animate-pulse" />
      </div>
    );
  }

  // If user is logged in, show dashboard link and logout button
  if (user) {
    return (
      <>
        <div className="w-1/2 my-4 border-t border-secondary" />
        <Link 
          href="/feed" 
          className="block py-2 text-xl font-medium text-foreground/80 hover:text-primary" 
          onClick={onClose}
        >
          Dashboard
        </Link>
        <LogoutButton 
          variant="ghost" 
          className="block py-2 text-xl font-medium text-foreground/80 hover:text-primary"
          onClick={onClose}
        />
      </>
    );
  }

  // If user is not logged in, show login/signup links
  return (
    <div className="flex flex-col space-y-2 p-4 border-t border-secondary">
      <Link 
        href="/login" 
        className="btn border border-secondary w-full text-center justify-center" 
        onClick={onClose}
      >
        Login
      </Link>
      <Link 
        href="/signup" 
        className="btn btn-primary w-full text-center justify-center" 
        onClick={onClose}
      >
        Sign Up
      </Link>
    </div>
  );
}