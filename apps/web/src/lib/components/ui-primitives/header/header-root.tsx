'use client';

import { ReactNode, useState, useEffect } from 'react';

export function HeaderRoot({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex items-center border-b transition-all duration-300 ${scrolled ? 'bg-background-muted/80 border-muted shadow-sm backdrop-blur-xl' : 'bg-background-muted border-transparent'} ${className} `}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="relative flex w-full items-center justify-between px-4 md:px-6">
        {children}
      </div>
    </header>
  );
}
